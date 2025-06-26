import {
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  TextField,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingAnimation from "../components/LoadingAnimation";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../features/userSlice";

const baseURL = import.meta.env.VITE_API_URL || "/api";
const SigninPage = ({ signIn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formdata, setFormdata] = useState({
    username: "",
    password: "",
  });
  const validateUsername = async (username) => {
    setUsernameStatus(null); //resetting
    const hasSpecialChars = /[^a-zA-Z0-9_]/.test(username.trim());
    if (hasSpecialChars) {
      console.warn("Username contains invalid characters");
      setUsernameStatus(false);
      return;
    }
    console.log("Validating username:", username);
    if (username.trim().length === 0) {
      console.warn("Username is empty after trimming");
      return;
    }
    try {
      const res = await axios.get(
        `${baseURL}/api/auth/validateUsername/${username.trim()}`
      );
      if (res.data.valid) {
        console.log("response from validateUsername : ", res.data);
        setFormdata((prev) => ({ ...prev, username: username.trim() }));
        setUsernameStatus(true);
      }
    } catch (error) {
      setUsernameStatus(false);
      console.error("Error validating username", error);
    }
  };
  const validatePassword = async (pswd) => {
    setPasswordStatus(null); //resetting
    console.log("Validating password:", pswd);
    if (pswd.trim().length === 0) {
      console.warn("Username is empty after trimming");
      return;
    }
    const longEnough = pswd.length >= 6;
    const hasUppercase = /[A-Z]/.test(pswd);
    const hasNumber = /\d/.test(pswd);
    const hasSpeChar = /[!@#$%^&*(),.?":{}|<>]/.test(pswd);
    const isValid = longEnough && hasUppercase && hasNumber && hasSpeChar;
    setPasswordStatus(isValid);
  };
  useEffect(() => {
    const id = setTimeout(() => {
      if (formdata.username.length > 0) {
        validateUsername(formdata.username);
      }
    }, 500);
    return () => clearTimeout(id);
  }, [formdata.username]);

  useEffect(() => {
    if (formdata.password.length > 0) {
      validatePassword(formdata.password);
    }
  }, [formdata.password]);
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${baseURL}/api/auth/signup`, formdata);
      const userData = res.data.user;
      const token = res.data.token;
      const coords = res.data.coords || { lat: 0, lng: 0 };
      const user = {
        user: userData,
        coords,
        token,
      };
      dispatch(setUser(user));
      localStorage.setItem("snapgram_user", JSON.stringify(user));
      console.log("Logged-in: ", user);
      navigate("/explore");
    } catch (error) {
      console.error("error in registering user", error);
    }
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: "#f5f5f5" }} // Light gray background
    >
      {isSubmitting && <LoadingAnimation />}

      {/* Logo Header */}
      <Box
        sx={{
          display: "flex",
          position: "fixed",
          top: 0,
          left: 4,
          width: "100%",
          p: 1,
          justifyContent: "space-between",
          backgroundColor: "white",
          zIndex: 1300,
        }}
      >
        <Typography
          sx={{
            fontSize: "2rem",
            color: "black",
            letterSpacing: 2,
            fontStyle: "italic",
            fontWeight: "bold",
            fontFamily: "cursive,'Pacifico'",
          }}
          variant="h4"
          color="primary"
          gutterBottom
        >
          SnapGram
        </Typography>
      </Box>

      {/* Form Container */}
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 4,
          gap: 3,
          width: 320,
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        {step === 0 && (
          <>
            <Typography variant="h6" sx={{ color: "#000", fontWeight: 500 }}>
              Create your account
            </Typography>

            {usernameStatus !== null && formdata.username.length > 0 && (
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: usernameStatus ? "#4CAF50" : "#F44336",
                }}
              >
                {usernameStatus ? "✓ Available" : "✗ Already taken"}
              </Typography>
            )}

            <FormControl fullWidth>
              <TextField
                label="Username"
                variant="outlined"
                size="small"
                value={formdata.username}
                onChange={(e) =>
                  setFormdata({ ...formdata, username: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#9e9e9e",
                    },
                    "&:hover fieldset": {
                      borderColor: "#616161",
                    },
                  },
                }}
              />
            </FormControl>

            <Button
              variant="contained"
              disabled={usernameStatus !== true}
              onClick={() => setStep(1)}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#424242",
                },
                py: 1.5,
                textTransform: "none",
              }}
            >
              Continue
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <Typography variant="h6" sx={{ color: "#000", fontWeight: 500 }}>
              Create a password
            </Typography>

            {passwordStatus !== null && formdata.password.length > 0 && (
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: passwordStatus ? "#4CAF50" : "#F44336",
                }}
              >
                {passwordStatus ? "✓ Strong password" : "✗ Weak password"}
              </Typography>
            )}

            <FormControl fullWidth>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                size="small"
                value={formdata.password}
                onChange={(e) =>
                  setFormdata({ ...formdata, password: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#9e9e9e",
                    },
                    "&:hover fieldset": {
                      borderColor: "#616161",
                    },
                  },
                }}
              />
            </FormControl>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setStep(0)}
                sx={{
                  borderColor: "#9e9e9e",
                  color: "#000",
                  flex: 1,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#616161",
                  },
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                disabled={passwordStatus !== true}
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  flex: 1,
                  "&:hover": {
                    backgroundColor: "#424242",
                  },
                  textTransform: "none",
                }}
              >
                Sign Up
              </Button>
            </Box>
          </>
        )}

        <Divider sx={{ my: 1, borderColor: "#e0e0e0" }} />

        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={signIn}
          sx={{
            borderColor: "#9e9e9e",
            color: "#000",
            textTransform: "none",
            "&:hover": {
              borderColor: "#616161",
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          Continue with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default SigninPage;
