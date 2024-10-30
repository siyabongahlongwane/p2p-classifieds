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
import { useState } from "react";

const SignUp = () => {
  const { error, loading, signUp } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    console.log(form);
    signUp(first_name, last_name, email, phone, password);
  };

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <Grid2
      display={"grid"}
      container
      gridTemplateColumns={"1fr 1fr"}
      height={"inherit"}
    >
      <Stack display={"flex"} alignItems={"center"}>
        <Stack width={"60%"} gap={2} mt={"5%"}>
          <Stack display={"flex"} gap={0.5}>
            <Typography variant="h5">Hello and Welcome!</Typography>
            <Typography fontWeight={400} variant="body2" color="gray">
              Register your account below
            </Typography>
            <Typography
              fontWeight={400}
              variant="body2"
              color="red"
              fontSize={18}
            >
              {error || ""}
            </Typography>
          </Stack>

          <Box
            component={"form"}
            onSubmit={handleSignUp}
            display={"flex"}
            flexDirection={"column"}
            gap={2}
          >
            <Stack gap={1}>
              <Typography variant="subtitle2">First Name</Typography>
              <TextField
                error={false}
                placeholder="Enter Frist Name"
                helperText=""
                value={form.first_name}
                name="first_name"
                onChange={handleInputChange}
              />
            </Stack>
            <Stack gap={1}>
              <Typography variant="subtitle2">Last Name</Typography>
              <TextField
                error={false}
                placeholder="Enter Last Name"
                helperText=""
                value={form.last_name}
                name="last_name"
                onChange={handleInputChange}
              />
            </Stack>
            <Stack gap={1}>
              <Typography variant="subtitle2">Email</Typography>
              <TextField
                error={false}
                placeholder="Enter Email"
                helperText=""
                value={form.email}
                name="email"
                onChange={handleInputChange}
              />
            </Stack>
            <Stack gap={1}>
              <Typography variant="subtitle2">Phone</Typography>
              <TextField
                error={false}
                placeholder="Enter Phone"
                helperText=""
                value={form.phone}
                name="phone"
                onChange={handleInputChange}
              />
            </Stack>
            <Stack gap={1}>
              <Typography variant="subtitle2">Password</Typography>
              <TextField
                error={false}
                placeholder="Enter Password"
                helperText=""
                value={form.password}
                name="password"
                onChange={handleInputChange}
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
