// SignIn Component
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { submitLogin } from "./submitLogic";
import LanguageSelector from "./LanguageSelector";
import { STATUS_BASED_ON_VIEW } from "../graphql/authQueries";
import { useLoginMutation } from "./graphqlOperations/authClient";

const defaultTheme = createTheme();

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  const loginUser = useLoginMutation(navigate, setAlertMessage, setShowAlert);
  const [updateStatusBasedOnView] = useMutation(STATUS_BASED_ON_VIEW);
  const userToken = localStorage.getItem("authToken");

  React.useEffect(() => {
    console.log("MOUNTING: ", userToken, location.pathname);
    updateStatusBasedOnView({
      variables: { token: userToken, location: location.pathname },
    });
  }, [location.pathname, userToken, updateStatusBasedOnView]);

  const handleSubmit = (event) => {
    event.preventDefault();
    submitLogin(
      event,
      username,
      password,
      loginUser,
      setAlertMessage,
      setShowAlert
    );
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <LanguageSelector /> {/* Use the LanguageSelector component here */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("signIn")}
          </Typography>

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("username")}
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("password")}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("signIn")}
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="/register" variant="body2">
                  {t("noAccount")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={() => setShowAlert(false)}
        >
          <Alert
            onClose={() => setShowAlert(false)}
            severity="warning"
            sx={{ width: "100%" }}
          >
            {alertMessage === "Network error. Please try again later."
              ? t("networkError")
              : alertMessage}
            {alertMessage === "An unexpected error occurred."
              ? t("unexpectedError")
              : alertMessage}
            {alertMessage === "Invalid username or password"
              ? t("invalidCredentials")
              : alertMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
