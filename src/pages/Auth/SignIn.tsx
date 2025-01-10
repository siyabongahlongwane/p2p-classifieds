import {
  Box,
  Button,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../stores/store";

const SignIn = () => {
  const [selectedLoginMethod, setSelectedLoginMethod] = useState("pwd");
  const { signIn, loading } = useAuth();
  const { setField } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(email, password, selectedLoginMethod);
  };

  useEffect(() => {
    setField('activeMenuItem', 0);
    if (selectedLoginMethod != "pwd") {
      setPassword("");
    }
  }, [selectedLoginMethod]);
  return (
    <Grid2
      display={"grid"}
      container
      gridTemplateColumns={"1fr 1fr"}
      height={"inherit"}
    >
      <Stack display={"flex"} alignItems={"center"}>
        <Stack width={"60%"} gap={2} mt={"25%"}>
          <Stack display={"flex"} gap={0.5}>
            <Typography variant="h5">Welcome back!</Typography>
            <Typography fontWeight={400} variant="body2" color="gray">
              Select Sign In method below
            </Typography>
          </Stack>
          <Box
            display={"flex"}
            width={"100%"}
            border="1px solid gray"
            borderRadius={"10px"}
          >
            <Box
              className={
                "pointer " +
                (selectedLoginMethod == "pwd" ? "selected-method" : "")
              }
              onClick={() => setSelectedLoginMethod("pwd")}
              textAlign={"center"}
              width={"100%"}
              p={0.5}
              borderRadius={2}
            >
              <Typography>Password</Typography>
            </Box>
            <Box
              className={
                "pointer " +
                (selectedLoginMethod == "otp" ? "selected-method" : "")
              }
              onClick={() => setSelectedLoginMethod("otp")}
              textAlign={"center"}
              width={"100%"}
              p={0.5}
              borderRadius={2}
            >
              <Typography>OTP</Typography>
            </Box>
          </Box>
          <Box
            component={"form"}
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            onSubmit={handleSignIn}
          >
            <Stack gap={1}>
              <Typography variant="subtitle2">Email</Typography>
              <TextField
                error={false}
                placeholder="Enter Email"
                helperText=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Stack>
            {selectedLoginMethod == "pwd" && (
              <Stack gap={1}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography variant="subtitle2">Password</Typography>
                  <Typography
                    variant="body2"
                    color="gray"
                    fontSize={12}
                    className="pointer"
                  >
                    Forgot Password?
                  </Typography>
                </Box>
                <TextField
                  error={false}
                  type="password"
                  placeholder="Enter Password"
                  helperText=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Stack>
            )}
            <Button
              variant="contained"
              className="primary-btn"
              style={{ pointerEvents: loading ? "none" : "auto" }}
              type="submit"
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </Box>
        </Stack>
        <Stack display={"flex"} gap={1} mt={1} alignItems={"center"}>
          <Typography fontStyle={"oblique"} color="gray">
            OR
          </Typography>
          <img
            className="pointer"
            src="google-sign-in.svg"
            alt="Google Sign In"
          />
          <Typography component={"small"} color="gray" fontWeight={300}>
            Don't have an account?
            <Link to={"/sign-up"}>
              <Typography ml={1} component={"span"} color="#000">
                Sign up
              </Typography>
            </Link>
          </Typography>
        </Stack>
      </Stack>
      <Box
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url(/stationery.jpg)",
        }}
        height={"inherit"}
        width={"100%"}
        borderRadius={"40px 0 0 40px"}
      ></Box>
    </Grid2>
  );
};

export default SignIn;
