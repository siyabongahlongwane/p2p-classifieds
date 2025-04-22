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
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { useUserStore } from '../../stores/useUserStore';
import useToastStore from "../../stores/useToastStore";
import ForgotPasswordDialog from "../../components/ForgotPasswordDialog/ForgotPasswordDialog";

interface SignInForm {
  email: string;
  password: string;
}

const SignIn = () => {
  const [selectedLoginMethod, setSelectedLoginMethod] = useState("pwd");
  const { signIn, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotDialog, setShowForgotDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInForm>({
    defaultValues: {
      email: "",
      password: ""
    }
  });


  const onSubmit = (data: SignInForm) => {
    signIn(data.email, data.password, selectedLoginMethod);
  };

  const googleLogin = (): void => {
    window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
  }

  const { setUser } = useUserStore();

  const userHash = new URLSearchParams(location.search)?.get('hash');
  const error = new URLSearchParams(location.search)?.get('error');

  const navigate = useNavigate();
  const { showToast } = useToastStore();

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      return;
    }

    if (userHash) {
      const result = JSON.parse(userHash);
      const roles = result.user.roles;

      localStorage.setItem('token', result.token || '');
      localStorage.setItem('user', JSON.stringify(result.user || ''));
      setUser(result.user);

      setTimeout(() => {
        if (roles.includes(3)) {
          navigate('/home');
        }
        else if (roles.includes(1)) {
          navigate('/admin/dashboard');
        }
        showToast('Logged in successfully', 'success');
      }, 1500);
    }
  }, [userHash, error])

  return (
    <Grid2
      display={"grid"}
      container
      gridTemplateColumns={"1fr 1fr"}
      height={"inherit"}
    >
      <Stack display={"flex"} alignItems={"center"}>
        <ForgotPasswordDialog open={showForgotDialog} onClose={() => setShowForgotDialog(false)} />
        <Stack width={"60%"} gap={2} mt={"25%"}>
          <Stack display={"flex"} gap={0.5}>
            <Typography variant="h5">Welcome back!</Typography>
            <Typography fontWeight={400} variant="body2" color="gray">
              Select Sign In method below
            </Typography>
          </Stack>
          <Box
            display={"none"}
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
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className="auth-form"
          >

            <Stack gap={1}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="subtitle2">Email</Typography>
              </Box>
              <TextField
                error={!!errors.email}
                type="email"
                placeholder="Enter Email"
                helperText={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
            </Stack>

            {selectedLoginMethod == "pwd" && (
              <Stack gap={1} mt={1}>
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
                    onClick={() => setShowForgotDialog(true)}
                  >
                    Forgot Password?
                  </Typography>
                </Box>
                <TextField
                  error={!!errors.password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
              </Stack>
            )}
            <Button
              variant="contained"
              className="primary-btn"
              style={{ pointerEvents: loading ? "none" : "auto", marginTop: 16 }}
              type="submit"
              fullWidth
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
            onClick={googleLogin}
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
