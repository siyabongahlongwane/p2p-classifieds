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

const SignUp = () => {
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
          </Stack>

          <Box
            component={"form"}
            display={"flex"}
            flexDirection={"column"}
            gap={2}
          >
            <Stack gap={1}>
              <Typography variant="subtitle2">Frist Name</Typography>
              <TextField
                error={false}
                placeholder="Enter Frist Name"
                helperText=""
              />
            </Stack>
            <Stack gap={1}>
              <Typography variant="subtitle2">Last Name</Typography>
              <TextField
                error={false}
                placeholder="Enter Last Name"
                helperText=""
              />
            </Stack>
            <Stack gap={1}>
              <Typography variant="subtitle2">Email</Typography>
              <TextField
                error={false}
                placeholder="Enter Email"
                helperText=""
              />
            </Stack>
            <Stack gap={1}>
              <Typography variant="subtitle2">Phone</Typography>
              <TextField
                error={false}
                placeholder="Enter Phone"
                helperText=""
              />
            </Stack>
            <Stack gap={1}>
              <Typography variant="subtitle2">Password</Typography>
              <TextField
                error={false}
                placeholder="Enter Password"
                helperText=""
              />
            </Stack>
            <Button variant="contained" className="primary-btn">
              Login
            </Button>
          </Box>
        </Stack>
        <Stack display={"flex"} gap={1} mt={1} alignItems={"center"}>
          <Typography fontStyle={"oblique"} color="gray">
            OR
          </Typography>
          <img
            className="pointer"
            src="../../../public/google-sign-in.svg"
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
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url(../../../public/stationery.jpg)",
        }}
        height={"inherit"}
        width={"100%"}
        borderRadius={"40px 0 0 40px"}
      ></Box>
    </Grid2>
  );
};

export default SignUp;
