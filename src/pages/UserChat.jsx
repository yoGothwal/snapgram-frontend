import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  IconButton,
  List,
  ListItemAvatar,
  ListItemText,
  Badge,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
  Mood as MoodIcon,
  MoreVert as MoreVertIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import axios from "axios";

import ImageMessage from "../components/ImageMessage";
import AudioMessage from "../components/AudioMessage";
import { useQuery } from "@tanstack/react-query";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const UserChat = () => {
  const { username } = useParams();
  const currentUser = useSelector((state) => state.user.user?.username);
  const token = useSelector((state) => state.user.token);
  const fetchUser = async () => {
    const res = await axios.get(`${baseURL}/api/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  const {
    data: fetchedUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: fetchUser,
    enabled: !!username && !!token,
  });

  if (!currentUser && !fetchedUser) return null;
  console.log(fetchedUser);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const inputFileRef = useRef();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; //10mb
  const [selectedImage, setSelectedImage] = useState(null);

  //audio states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const audioChunksRef = useRef([]); //to record audio chunks
  const mediaRecorderRef = useRef(null); //for microphone
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimeRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      console.log("No current user, skipping WebSocket connection");
      return;
    }

    console.log(
      `Connecting to WebSocket for ${currentUser} chatting with ${username}`
    );
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
      ws.send(
        JSON.stringify({
          type: "login",
          username: currentUser,
        })
      );
      ws.send(
        JSON.stringify({
          type: "get_history",
          withUser: username,
        })
      );
    };

    ws.onclose = () => {
      console.log("Websocket disconnected");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.log("Websocket Error: ", error);
    };

    ws.onmessage = (event) => {
      console.log("Received message:", event.data);

      const data = JSON.parse(event.data);
      if (data.type === "message") {
        console.log("new message recieved:", data.payload);
        setMessages((prev) => [
          ...prev,
          {
            ...data.payload,
            sender: data.payload.sender === currentUser ? "me" : "them",
          },
        ]);
      } else if (data.type === "history") {
        console.log("history recieved:", data.payload);
        setMessages(
          data.payload.map((msg) => ({
            ...msg,
            sender: msg.sender === currentUser ? "me" : "them",
          }))
        );
      }
    };
    setSocket(ws);
    return () => {
      console.log("Cleaning up WebSocket");
      ws.close();
    };
  }, [currentUser, username]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(`${baseURL}/upload/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          // Optional: Add progress tracking
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`${percentCompleted}% uploaded`);
        },
      });

      console.log("Upload successful:", res.data);
      return {
        imageUrl: res.data.imageUrl,
        publicId: res.data.publicId, // Include publicId in return
      };
    } catch (e) {
      console.error("Image upload failed", e);
      alert(e.response?.data?.message || "Failed to upload image");
      return null;
    }
  };
  const uploadAudio = async (audio) => {
    console.log("trying to upload audio...");
    try {
      const formData = new FormData();
      formData.append("audio", audio);
      const res = await axios.post(`${baseURL}/upload/audio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const percent = Math.floor((event.loaded / event.total) * 100);
          console.log(`${percent}% audio uploaded`);
        },
      });
      console.log("Upload successful:", res.data);
      return {
        audioUrl: res.data.audioUrl,
        publicId: res.data.publicId, // Include publicId in return
      };
    } catch (error) {
      console.error("Audio upload failed", error);
      alert("Failed to upload audio");
      return null;
    }
  };
  const handleSendMessage = useCallback(async () => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !currentUser) {
      return;
    }
    const msg = { type: "message", to: username };
    console.log(`Sending message to ${username}:`, newMessage);
    try {
      if (selectedImage) {
        const res = await uploadImage(selectedImage.file);
        console.log(res);
        if (!res) return;
        socket.send(JSON.stringify({ ...msg, imageUrl: res.imageUrl }));
        setSelectedImage(null);
      }
      if (recordedAudio) {
        const res = await uploadAudio(recordedAudio.blob);
        console.log(res);
        if (!res) return;
        socket.send(JSON.stringify({ ...msg, audioUrl: res.audioUrl }));
        setRecordedAudio(null);
      }
      if (newMessage.trim() && !selectedImage) {
        socket.send(JSON.stringify({ ...msg, text: newMessage }));
        setNewMessage("");
      }
      console.log("Message sent successfully");
    } catch (error) {
      alert("Message failed");
      console.error("Error in sending message: ", error);
    }
  }, [newMessage, socket, username, currentUser, selectedImage, recordedAudio]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    const oldPreview = selectedImage?.preview;

    return () => {
      if (oldPreview) URL.revokeObjectURL(oldPreview);
    };
  }, [selectedImage]);

  //Audio functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream); //created microphone instance

      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setRecordedAudio({
          blob: audioBlob,
          url: URL.createObjectURL(audioBlob),
        });
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      recordingTimeRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      console.log("recording started");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access denied. Please check permissions.");
    }
  };
  const stopRecording = () => {
    console.log("recording paused");
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimeRef.current);
      setRecordingTime(0);
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "auto",
        mb: 5,
        bgcolor: "white",
      }}
    >
      {/* Chat header */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 10,
        }}
      >
        <Box onClick={() => navigate(-1)} sx={{ mr: 1, cursor: "pointer" }}>
          <ArrowBackIcon />
        </Box>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          color="success"
        >
          {fetchedUser && (
            <ImageMessage
              imageUrl={
                fetchedUser?.user.profilePicture ||
                "https://i.pravatar.cc/150?u=${username}"
              }
            >
              <Avatar
                alt={username}
                src={
                  fetchedUser?.user.profilePicture ||
                  "https://i.pravatar.cc/150?u=${username}"
                }
              />
            </ImageMessage>
          )}
        </Badge>
        <Box
          onClick={() => navigate(`/${fetchedUser.user.username}`)}
          sx={{ ml: 2, flexGrow: 1, cursor: "pointer" }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {username}
          </Typography>
          <Typography
            variant="caption"
            color={isConnected ? "success.main" : "error.main"}
          >
            {isConnected ? "online" : "connecting..."}
          </Typography>
        </Box>
        {/* <Box sx={{ p: 1, mr: 2 }}>
          <MoreVertIcon />
        </Box> */}
      </Paper>

      {/* Messages area */}
      <Box
        sx={{
          flexGrow: 1,
          mt: 8,
          mb: 2,
          overflowY: "auto",

          backgroundImage:
            'url("https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png")',
          backgroundRepeat: "repeat",
        }}
      >
        <List sx={{ width: "100%", maxWidth: "800px", mx: "auto" }}>
          {messages.map((message, id) => {
            const nextMessage = messages[id + 1];
            const showTime = !nextMessage || message.time !== nextMessage.time;
            return (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  flexDirection:
                    message.sender === "me" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  px: 1,
                }}
              >
                {message.sender === "them" && (
                  <ListItemAvatar sx={{ minWidth: 40, alignSelf: "flex-end" }}>
                    <Avatar
                      alt={username}
                      src={`https://i.pravatar.cc/150?u=${username}`}
                      sx={{ width: 32, height: 32 }}
                    />
                  </ListItemAvatar>
                )}
                <ListItemText
                  sx={{
                    ml: message.sender === "me" ? 0 : 1,
                    mr: message.sender === "me" ? 1 : 0,
                    maxWidth: message.imageUrl ? "30%" : "70%",
                  }}
                  primary={
                    <Paper
                      elevation={0}
                      sx={{
                        p: message.imageUrl ? 0 : message.audioUrl ? 0 : 1.5,

                        // border: message.imageUrl ? "0px solid #e4e6eb" : "none",
                        borderRadius:
                          message.sender === "me"
                            ? "18px 18px 0 18px"
                            : "18px 18px 18px 0",
                        bgcolor:
                          message.imageUrl || message.audioUrl
                            ? "transparent"
                            : message.sender === "me"
                              ? "black"
                              : "#e4e6eb",
                        color: message.sender === "me" ? "white" : "black",
                        wordBreak: "break-word",

                        cursor: "pointer",
                      }}
                    >
                      <Typography
                        component="div"
                        color={message.sender === "me" ? "white" : "black"}
                      >
                        {message.text}
                        {message.imageUrl && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent:
                                message.sender === "me"
                                  ? "flex-end"
                                  : "flex-start",
                            }}
                          >
                            <ImageMessage imageUrl={message.imageUrl}>
                              <img
                                src={message.imageUrl}
                                alt="Click to enlarge"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "200px",
                                  borderRadius: "8px",
                                  marginTop: 8,
                                  display: "block", // Important for click handling
                                }}
                              />
                            </ImageMessage>
                          </Box>
                        )}
                        {message.audioUrl && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent:
                                message.sender === "me"
                                  ? "flex-end"
                                  : "flex-start",
                            }}
                          >
                            <AudioMessage audioUrl={message.audioUrl} />
                          </Box>
                        )}
                      </Typography>
                    </Paper>
                  }
                  secondary={
                    showTime ? (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: message.sender === "me" ? "right" : "left",
                          color: "text.secondary",
                          mt: 0.5,
                        }}
                      >
                        {message.time}
                      </Typography>
                    ) : null
                  }
                />
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/*Chat Footer */}
      <Paper
        elevation={0}
        sx={{
          p: 1,
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
          borderRadius: 0,
        }}
      >
        {
          /* image preview thumbnail */
          selectedImage && (
            <Box
              sx={{
                position: "relative",
                width: "fit-content",
                mx: "auto",
                mb: 1,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
              }}
            >
              <img
                src={selectedImage.preview}
                alt="Preview"
                style={{
                  maxWidth: "50px",
                  maxHeight: "50px",
                  display: "block",
                  borderRadius: "8px",
                }}
              ></img>
              <Box
                onClick={() => {
                  URL.revokeObjectURL(selectedImage.preview); //cleans memory used by url
                  setSelectedImage(null);
                }}
                sx={{
                  // fontSize: "5px",
                  position: "absolute",
                  top: 0,
                  right: 4,
                  cursor: "pointer",
                  color: "black",
                  backgroundColor: "white",
                }}
              >
                ✕
              </Box>
            </Box>
          )
        }
        {
          /*recording animation */
          isRecording && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 1,
                position: "absolute",
                bottom: "100%",
                left: 0,
                right: 0,
                bgcolor: "background.paper",
                p: 1,
                border: "1px solid #ddd",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  "& .pulse-dot": {
                    color: "black",

                    animation: "pulse 1s infinite",

                    "@keyframes pulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.5 },
                      "100%": { opacity: 1 },
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    bgcolor: "red",
                    animation: "pulse 1s infinite",
                  }}
                />
                <Typography>Recording: {recordingTime}s</Typography>
              </Box>
            </Box>
          )
        }
        {
          /* audio preview thumbnail */
          recordedAudio && !isRecording && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 1,
                position: "absolute",
                bottom: "100%",
                left: 0,
                right: 0,
                bgcolor: "background.paper",
                p: 1,
                border: "1px solid #ddd",
              }}
            >
              <audio controls src={recordedAudio.url}></audio>
              <Button
                size="small"
                onClick={() => setRecordedAudio(null)}
                startIcon={<CancelIcon />}
              ></Button>
            </Box>
          )
        }
        {/* Bottom Icons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 1,
            mr: 1,
            mb: 1,
          }}
        >
          <IconButton>
            <MoodIcon />
          </IconButton>

          <input
            type="file"
            accept="image/*"
            ref={inputFileRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                console.log("File selected: ", file.name, file.type, file.size);
              }
              if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                alert("Please provide valid image format");
                return;
              }
              if (file.size > MAX_IMAGE_SIZE) {
                alert("Image size must be below 10mb");
                return;
              }
              setSelectedImage({
                file,
                preview: URL.createObjectURL(file),
              });
              console.log("Valid image selected");
            }}
          ></input>
          <IconButton onClick={() => inputFileRef.current.click()}>
            <AttachFileIcon />
          </IconButton>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              maxWidth: "800px",
              mx: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                bgcolor: "#f0f2f5",
              },
            }}
          />
          {newMessage || selectedImage || recordedAudio ? (
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={
                (!newMessage.trim() && !selectedImage && !recordedAudio) ||
                !isConnected
              }
            >
              <SendIcon />
            </IconButton>
          ) : (
            <IconButton
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              color={isRecording ? "error" : "default"}
            >
              <MicIcon />
            </IconButton>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserChat;
