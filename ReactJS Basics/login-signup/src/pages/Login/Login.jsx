import React, { useContext } from "react";
import { Link, Typography, Avatar, Grid, Box, Container } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import UserContext from "../../context/User/UserContext";
import SnackbarContext from "../../context/Snackbar/SnackbarContext";
import FormCheckbox from "../../components/Form/FormCheckbox";
import FormInputText from "../../components/Form/FormInputText";
import FormButton from "../../components/Form/FormButton";
import { loginSchema } from "../../Validations/UserValidation";

const SignIn = () => {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const { user, setIsLoggedIn } = useContext(UserContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();

  const onSubmit = ({
    email: userEmail,
    password: userPassword,
    remember: keepLoggedIn,
  }) => {
    console.log(userEmail, userPassword, keepLoggedIn);

    if (!user) {
      showSnackbar({ message: "Please SignUp first!", type: "warning" });
      return;
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
      return;
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 18,
          marginBottom: 18,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <FormInputText
            name="email"
            control={control}
            required={true}
            label="Email Address"
            type="email"
            autoFocus={true}
            autoComplete="email"
          />

          <FormInputText
            name="password"
            required={true}
            control={control}
            label="Password"
            type="password"
            autoComplete="current-password"
          />

          <FormCheckbox name="remember" control={control} label="Remember Me" />

          <FormButton
            type="submit"
            fullWidth={true}
            text="SIGN IN"
            style={{ mt: 3, mb: 2, fontWeight: "bold" }}
          />

          <Grid container>
            <Grid item xs>
              <Link
                component={RouterLink}
                to="/reset-password"
                color="primary"
                underline="none"
              >
                <Typography variant="body2">Forgot password?</Typography>
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
