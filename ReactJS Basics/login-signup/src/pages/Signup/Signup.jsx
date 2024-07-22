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
import { signupSchema } from "../../Validations/UserValidation";

const SignUp = () => {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const { setUser } = useContext(UserContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();

  const onSubmit = ({ firstName, lastName, email, password }) => {
    console.log(firstName, lastName, email, password);
    setUser({ firstName, lastName, email, password });
    showSnackbar({ message: "User registered successfully!", type: "success" });
    navigate("/login", { replace: true });
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
          Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 3 }}
        >
          <Grid container spacing={{ xs: 0, sm: 2 }}>
            <Grid item xs={12} sm={6}>
              <FormInputText
                name="firstName"
                control={control}
                required={true}
                label="First Name"
                type="text"
                autoFocus={true}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormInputText
                name="lastName"
                control={control}
                required={true}
                label="Last Name"
                type="text"
              />
            </Grid>
          </Grid>

          <FormInputText
            name="email"
            control={control}
            required={true}
            label="Email Address"
            type="email"
            autoComplete="email"
          />

          <FormInputText
            name="password"
            required={true}
            control={control}
            label="Password"
            type="password"
            autoComplete="new-password"
          />

          <FormCheckbox
            name="allowExtraEmails"
            control={control}
            label="I want to receive inspiration, marketing promotions and updates via email."
            style={{ mt: 1 }}
          />

          <FormButton
            type="submit"
            fullWidth={true}
            text="SIGN UP"
            style={{ mt: 3, mb: 2, fontWeight: "bold" }}
          />

          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2" component="span">
                Already have an account?{" "}
              </Typography>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                color="primary"
                underline="none"
              >
                Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
