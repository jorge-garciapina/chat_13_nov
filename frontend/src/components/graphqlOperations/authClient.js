import * as React from "react";
import { useMutation } from "@apollo/client";
import {
  LOGOUT_USER_MUTATION,
  LOGIN_MUTATION,
} from "./../../graphql/authQueries";

export const useLogout = () => {
  const [logoutUser] = useMutation(LOGOUT_USER_MUTATION);

  const userToken = localStorage.getItem("authToken");

  // Logout before page unload
  React.useEffect(() => {
    const logoutBeforeUnload = () => {
      logoutUser({ variables: { token: userToken } });
    };

    window.addEventListener("beforeunload", logoutBeforeUnload);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("beforeunload", logoutBeforeUnload);
    };
  }, [userToken, logoutUser]);

  return logoutUser;
};

export const useLoginMutation = (navigate, setAlertMessage, setShowAlert) => {
  const [loginUser] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.loginUser.token) {
        localStorage.setItem("authToken", data.loginUser.token);
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      if (error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error.networkError) {
        errorMessage = "Network error. Please try again later.";
      }
      setAlertMessage(errorMessage);
      setShowAlert(true);
    },
  });

  return loginUser;
};
