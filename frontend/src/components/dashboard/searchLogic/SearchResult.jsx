import React from "react";
import { useSelector } from "react-redux";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import {
  useSendContactRequest,
  useCancelContactRequest,
} from "./../../graphqlOperations/userClient";

const SearchResult = ({ user }) => {
  const pendingContactRequests = useSelector(
    (state) => state.userInfo.pendingCR
  );
  const contactList = useSelector((state) => state.userInfo.contactList);

  const isPendingRequest = pendingContactRequests.includes(user.username);
  const isContact = contactList.includes(user.username);

  const handleSendMessageClick = () => {
    console.log(`Send message to: ${user.username}`);
  };

  const { sendContactRequest, sending } = useSendContactRequest(
    pendingContactRequests,
    user.username
  );
  const { cancelRequest, cancelling } = useCancelContactRequest(user.username);

  const handleAddFriendClick = () => {
    sendContactRequest(user.username);
  };

  const handleCancelRequestClick = () => {
    cancelRequest(user.username);
  };

  const isButtonDisabled = sending || cancelling;

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={user.avatar} alt={user.username} />
      </ListItemAvatar>
      <ListItemText primary={user.username} />
      {!isContact ? (
        !isPendingRequest ? (
          <Button onClick={handleAddFriendClick} disabled={isButtonDisabled}>
            {sending ? "Sending..." : "Add friend"}
          </Button>
        ) : (
          <Button
            onClick={handleCancelRequestClick}
            disabled={isButtonDisabled}
          >
            {cancelling ? "Cancelling..." : "Cancel Request"}
          </Button>
        )
      ) : (
        <Button onClick={handleSendMessageClick} disabled={isButtonDisabled}>
          Send Message
        </Button>
      )}
    </ListItem>
  );
};

export default SearchResult;
