// Dashboard.js
import * as React from "react";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import {
  LOGOUT_USER_MUTATION,
  STATUS_BASED_ON_VIEW,
} from "../../graphql/authQueries";
import { useLocation } from "react-router-dom";
import { useUserInfo } from "./../graphqlOperations/userClient";

// OTHER REACT COMPONENTS
import GeneralNotifications from "./GeneralNotifications";
import Contacts from "./contactsLogic/Contacts";
import Conversation from "./conversationLogic/ConversationComponent";
import CreateGroupConversationButton from "./groupChatButton";
import Conversations from "./Conversations";
import SearchComponent from "./searchLogic/SearchComponent";
import Subscriptions from "./../graphqlOperations/Subscriptions";

export default function Dashboard() {
  const location = useLocation();

  // EXTACT USER INFO AND UPDATE THE REDUX STATE:
  useUserInfo();
  const username = useSelector((state) => state.userInfo.username);

  // Updating status based on location
  const [updateStatusBasedOnView] = useMutation(STATUS_BASED_ON_VIEW);
  const userToken = localStorage.getItem("authToken");

  React.useEffect(() => {
    updateStatusBasedOnView({
      variables: { token: userToken, location: location.pathname },
    });
  }, [location.pathname, userToken, updateStatusBasedOnView]);

  // Logout mutation
  const [logoutUser] = useMutation(LOGOUT_USER_MUTATION);

  // Logout before page unload
  React.useEffect(() => {
    const logoutBeforeUnload = () => {
      logoutUser({ variables: { token: userToken } });
    };
    window.addEventListener("beforeunload", logoutBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", logoutBeforeUnload);
    };
  }, [userToken, logoutUser]);

  // The rest of the component rendering logic remains unchanged
  return (
    <div>
      <Subscriptions />
      <button onClick={() => logoutUser({ variables: { token: userToken } })}>
        Logout
      </button>
      <CreateGroupConversationButton />
      <h1>{username}</h1>
      <SearchComponent />
      <GeneralNotifications />
      <Contacts />
      <Conversation />
      <Conversations />
    </div>
  );
}
