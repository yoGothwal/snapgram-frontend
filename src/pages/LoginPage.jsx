import {
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  TextField,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingAnimation from "../components/LoadingAnimation";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../features/userSlice";

const baseURL = import.meta.env.VITE_API_URL || "/api";
const LoginPage = ({ signIn }) => {
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
    >
      {isSubmitting && <LoadingAnimation></LoadingAnimation>}
      {/*Logo*/}
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
            color: "primary.main",
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
      {/* <Typography
        sx={{ textAlign: "center", fontSize: "1.5rem" }}
        gutterBottom
        color="primary.main"
      >
        Sign In
      </Typography> */}

      {step === 0 && (
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: 2,
            gap: 2,
            width: 250,
          }}
        >
          {usernameStatus !== null &&
            formdata.username.length > 0 &&
            step === 0 && (
              <Typography
                color={usernameStatus ? "success.main" : "error.main"}
                sx={{ fontSize: "0.8rem", mt: -1 }}
              >
                {usernameStatus ? "✓ Username available" : "✗ Username taken"}
              </Typography>
            )}
          <FormControl>
            <TextField
              label="username"
              value={formdata.username}
              id="username"
              onChange={(e) =>
                setFormdata((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            ></TextField>
          </FormControl>

          <Button
            variant="contained"
            onClick={() => {
              if (usernameStatus === false || formdata.username.length === 0) {
                return;
              }
              setStep((prev) => prev + 1);
            }}
            sx={{ textTransform: "none", fontSize: "1rem", px: 3, py: 1.5 }}
          >
            Next
          </Button>
        </Paper>
      )}
      {step === 1 && (
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: 2,
            gap: 2,
            width: 250,
          }}
        >
          {passwordStatus !== null &&
            formdata.password.length > 0 &&
            step === 1 && (
              <Typography
                color={passwordStatus ? "success.main" : "error.main"}
                sx={{ fontSize: "0.8rem", mt: -1 }}
              >
                {passwordStatus
                  ? "✓ Strong password"
                  : "✗ Password must be at least 6 characters long, contain an uppercase letter, a number, and a special character"}
              </Typography>
            )}
          <FormControl>
            <TextField
              onChange={(e) =>
                setFormdata((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              value={formdata.password}
              label="password"
              type="password"
              id="password"
            ></TextField>
          </FormControl>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="outlined"
              onClick={() => setStep((prev) => prev - 1)}
              sx={{ textTransform: "none", fontSize: "1rem", px: 3, py: 1.5 }}
            >
              Prev
            </Button>
            <Button
              onClick={() => {
                if (
                  passwordStatus === false ||
                  formdata.password.length === 0
                ) {
                  return;
                }

                handleSubmit();
              }}
              variant="contained"
              sx={{ textTransform: "none", fontSize: "1rem", px: 3, py: 1.5 }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      )}

      {step < 2 && (
        <>
          <Typography gutterBottom mb={2}>
            Or
          </Typography>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={signIn}
            sx={{ textTransform: "none", fontSize: "1rem", px: 3, py: 1.5 }}
          >
            Sign in with Google
          </Button>
        </>
      )}
    </Box>
  );
};

export default LoginPage;
