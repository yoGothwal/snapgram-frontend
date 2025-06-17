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
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
  Mood as MoodIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

const UserChat = () => {
  const { username } = useParams();
  const currentUser = useSelector((state) => state.user.user?.username);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const inputFileRef = useRef();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      console.log("No current user, skipping WebSocket connection");
      return;
    }

    console.log(
      `Connecting to WebSocket for ${currentUser} chatting with ${username}`
    );
    const ws = new WebSocket("ws://localhost:8080");
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

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) {
      console.log("Empty message, not sending");
      return;
    }
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not ready, current state:", socket?.readyState);
      return;
    }
    if (!currentUser) {
      console.log("No current user, cannot send");
      return;
    }

    console.log(`Sending message to ${username}:`, newMessage);
    try {
      socket.send(
        JSON.stringify({
          type: "message",
          to: username,
          text: newMessage,
        })
      );
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }, [newMessage, socket, username, currentUser]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        <Box onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </Box>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          color="success"
        >
          <Avatar
            alt={username}
            src={`https://i.pravatar.cc/150?u=${username}`}
          />
        </Badge>
        <Box sx={{ ml: 2, flexGrow: 1 }}>
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
        <Box sx={{ p: 1, mr: 2 }}>
          <MoreVertIcon />
        </Box>
      </Paper>

      {/* Messages area */}
      <Box
        sx={{
          flexGrow: 1,
          mt: 6,
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
                    maxWidth: "70%",
                  }}
                  primary={
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius:
                          message.sender === "me"
                            ? "18px 18px 0 18px"
                            : "18px 18px 18px 0",
                        bgcolor: message.sender === "me" ? "black" : "#e4e6eb",
                        color: message.sender === "me" ? "white" : "black",
                        wordBreak: "break-word",
                      }}
                    >
                      {message.text}
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
        <Box sx={{ display: "flex", alignItems: "center", px: 1, mr: 1 }}>
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
            }}
          ></input>
          <IconButton onClick={() => inputFileRef.current.click()}>
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            size="small"
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              mx: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                bgcolor: "#f0f2f5",
              },
            }}
          />
          {newMessage ? (
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
            >
              <SendIcon />
            </IconButton>
          ) : (
            <IconButton>
              <MicIcon />
            </IconButton>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserChat;
