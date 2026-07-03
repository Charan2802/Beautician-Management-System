import { Box, Typography, Checkbox } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

import "../styles/login.css";

import banner from "../assets/login-banner.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginHandler = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "name",
        response.data.name
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      if (remember) {
        localStorage.setItem(
          "rememberEmail",
          email
        );
      }

      navigate("/dashboard");
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* LEFT SIDE */}
        <div className="login-left">
          <img
            src={banner}
            alt="login banner"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">

          <Typography
            className="login-title"
          >
            Welcome Back,
            <br />
            Team ✨
          </Typography>

          <Typography
            className="login-subtitle"
          >
            Sign in to continue
            to your dashboard
          </Typography>

          <Box sx={{ mt: 6 }}>

            <Typography mb={1}>
              Email
            </Typography>

            <CustomInput
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <Typography
              mb={1}
              mt={2}
            >
              Password
            </Typography>

            <CustomInput
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            {/* FIXED BOX */}
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                mb: 4,
                mt: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                }}
              >
                <Checkbox
                  checked={remember}
                  onChange={(e) =>
                    setRemember(
                      e.target.checked
                    )
                  }
                />

                <Typography>
                  Remember me
                </Typography>
              </Box>

              <Typography
                sx={{
                  color:
                    "#cf7d63",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold",
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            {error && (
              <Typography
                color="error"
                mb={2}
              >
                {error}
              </Typography>
            )}

            <CustomButton
              onClick={
                loginHandler
              }
              disabled={
                loading
              }
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </CustomButton>

          </Box>
        </div>
      </div>
    </div>
  );
}