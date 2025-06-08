import { useState, useEffect, useRef } from "react";
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
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
  Mood as MoodIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

// Mock messages - in a real app these would come from an API
const mockMessages = [
  { id: 1, sender: "them", text: "Hey there!", time: "10:30 AM" },
  { id: 2, sender: "me", text: "Hi! How are you?", time: "10:32 AM" },
  {
    id: 3,
    sender: "them",
    text: "I'm good, thanks for asking. How about you?",
    time: "10:33 AM",
  },
  {
    id: 4,
    sender: "me",
    text: "Doing well! Just working on some projects.",
    time: "10:35 AM",
  },
];

const UserChat = () => {
  const { username } = useParams();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      id: messages.length + 1,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "auto",
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
        <Box onClick={handleBack} sx={{ mr: 1 }}>
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
          <Typography variant="caption" color="text.secondary">
            Online
          </Typography>
        </Box>
        <Box sx={{ p: 1, mr: 1 }}>
          <MoreVertIcon />
        </Box>
      </Paper>

      {/* Messages area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          backgroundImage:
            'url("https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png")',
          backgroundRepeat: "repeat",
          mt: 4,
        }}
      >
        <List sx={{ width: "100%", maxWidth: "800px", mx: "auto" }}>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                display: "flex",
                flexDirection: message.sender === "me" ? "row-reverse" : "row",
                alignItems: "flex-start",
                px: 1,
                py: 0.5,
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
                      bgcolor: message.sender === "me" ? "#0084ff" : "#e4e6eb",
                      color: message.sender === "me" ? "white" : "black",
                      wordBreak: "break-word",
                    }}
                  >
                    {message.text}
                  </Paper>
                }
                secondary={
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
                }
              />
            </ListItem>
          ))}
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
          <IconButton>
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
              disabled={!newMessage.trim()}
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
