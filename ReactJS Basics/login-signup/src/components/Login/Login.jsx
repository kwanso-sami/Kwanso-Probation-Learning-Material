import React, { useContext } from "react";
import {
  Link,
  Typography,
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import SnackbarContext from "../../context/SnackbarContext";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

const SignIn = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { user, setIsLoggedIn } = useContext(UserContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const navigate = useNavigate();

  const onSubmit = ({
    email: userEmail,
    password: userPassword,
    remember: keepLoggedIn,
  }) => {
    console.log(user);

    if (!user) {
      console.log("hello");
      showSnackbar({ message: "Please SignUp first!", type: "warning" });
      navigate("/signup", { replace: true });
    }

    if (userEmail === user.email && userPassword === user.password) {
      setIsLoggedIn(true);
      showSnackbar({
        message: "You have logged in successfully!",
        type: "success",
      });
      navigate("/user", { replace: true });
    } else {
      showSnackbar({ message: "Invalid Email or Password!", type: "error" });
    }
  };

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      showSnackbar({
        message: errors[Object.keys(errors)[0]].message,
        type: "error",
      });
    }
  }, [errors]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : null}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : null}
              />
            )}
          />
          <Controller
            name="remember"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} color="primary" />}
                label="Remember me"
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item xs>
              <Link
                component={RouterLink}
                to="/reset-password"
                color="primary"
                underline="none"
              >
                <Typography variant="body2">Forgot password</Typography>
              </Link>
            </Grid>
            <Grid item>
              <Typography variant="body2" component="span">
                Don't have an account?{" "}
              </Typography>
              <Link
                component={RouterLink}
                to="/signup"
                variant="body2"
                color="primary"
                underline="none"
              >
                Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
