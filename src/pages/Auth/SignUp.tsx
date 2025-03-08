import {
  Box,
  Button,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import "./Auth.css";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { useState } from "react";

export interface SignUpForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

const SignUp = () => {
  const { loading, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);


  const onSubmit = (data: SignUpForm) => {
    signUp(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpForm>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: ""
    }
  });

  return (
    <Grid2
      display={"grid"}
      container
      gridTemplateColumns={"1fr 1fr"}
      height={"inherit"}
    >
      <Stack display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <Stack width={"60%"} gap={2} mt={"5%"}>
          <Stack display={"flex"} gap={0.5}>
            <Typography variant="h5">Hello and Welcome!</Typography>
            <Typography fontWeight={400} variant="body2" color="gray">
              Register your account below
            </Typography>
          </Stack>

          <Box
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
            display={"flex"}
            flexDirection={"column"}
            gap={2}
          >
            <Stack gap={1}>
              <Typography variant="subtitle2">First Name</Typography>
              <TextField
                error={!!errors.first_name}
                placeholder="Enter First Name"
                helperText={errors.first_name?.message}
                {...register("first_name", {
                  required: "First name is required"
                })}
              />
            </Stack>

            <Stack gap={1}>
              <Typography variant="subtitle2">Last Name</Typography>
              <TextField
                error={!!errors.last_name}
                placeholder="Enter Last Name"
                helperText={errors.last_name?.message}
                {...register("last_name", {
                  required: "Last name is required"
                })}
              />
            </Stack>

            <Stack gap={1}>
              <Typography variant="subtitle2">Email</Typography>
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

            <Stack gap={1}>
              <Typography variant="subtitle2">Phone Number</Typography>
              <TextField
                error={!!errors.phone}
                placeholder="Enter Phone Number"
                helperText={errors.phone?.message}
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number"
                  }
                })}
              />
            </Stack>

            <Stack gap={1}>
              <Typography variant="subtitle2">Password</Typography>
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
            <Button
              variant="contained"
              className="primary-btn"
              type="submit"
              style={{ pointerEvents: loading ? "none" : "auto" }}
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>
          </Box>
        </Stack>
        <Stack display={"flex"} gap={1} mt={1} alignItems={"center"}>
          <Typography fontStyle={"oblique"} color="gray">
            OR
          </Typography>
          <img
            className="pointer"
            src="/google-sign-in.svg"
            alt="Google Sign In"
          />
          <Typography component={"small"} color="gray" fontWeight={300}>
            Don't have an account?
            <Link to={"/sign-in"}>
              <Typography ml={1} component={"span"} color="#000">
                Sign in
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

export default SignUp;
