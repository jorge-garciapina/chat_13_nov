// Subscriptions.js
import { useSubscription } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";
import {
  loginAction,
  logoutAction,
  addNewConversation,
  addContactRequest,
  removeContactRequest,
  appendMessage,
  updateLastMessage,
  addToContactList,
  removePendingContactRequest,
} from "./../../redux/actions";
import {
  CHANGE_USER_STATUS,
  NEW_CONVERSATION,
  CONTACT_REQUEST_NOTIFICATION,
  CANCEL_REQUEST_NOTIFICATION,
  NOTIFY_NEW_MESSAGE,
  ACCEPTED_REQUEST_NOTIFICATION,
  REJECTED_REQUEST_NOTIFICATION,
} from "./../../graphql/subscriptionClient";

function Subscriptions() {
  const username = useSelector((state) => state.userInfo.username);
  const currentConversationId = useSelector(
    (state) => state.conversation.conversationId
  ); // Access the current conversation ID

  const dispatch = useDispatch();

  // NEW_CONVERSATION subscription
  useSubscription(NEW_CONVERSATION, {
    variables: { username },
    onData: ({ data }) => {
      const newConversation = data.data.newConversation;
      if (newConversation.isGroupalChat) {
        dispatch(addNewConversation(newConversation));
      } else {
        const { participants } = newConversation;
        const interlocutor = participants.filter((user) => {
          return user !== username;
        })[0];
        newConversation.name = interlocutor;

        dispatch(addNewConversation(newConversation));
      }
    },
  });

  // CHANGE_USER_STATUS subscription
  useSubscription(CHANGE_USER_STATUS, {
    variables: { username },
    onData: ({ data }) => {
      const { username, status } = data.data.changeUserStatus;
      if (status === "ONLINE") {
        dispatch(loginAction(username, status));
      } else if (status === "OFFLINE") {
        dispatch(logoutAction(username));
      }
    },
  });

  // CONTACT_REQUEST_NOTIFICATION subscription
  useSubscription(CONTACT_REQUEST_NOTIFICATION, {
    variables: { username },
    onData: ({ data }) => {
      const contactRequest = data.data.contactRequestNotification;
      dispatch(addContactRequest(contactRequest.sender));
    },
  });

  // CANCEL_REQUEST_NOTIFICATION subscription
  useSubscription(CANCEL_REQUEST_NOTIFICATION, {
    variables: { username },
    onData: ({ data }) => {
      const cancelRequest = data.data.cancelRequestNotification;
      dispatch(removeContactRequest(cancelRequest.sender));
    },
  });

  // NOTIFY_NEW_MESSAGE subscription
  useSubscription(NOTIFY_NEW_MESSAGE, {
    variables: { username },
    onData: ({ data }) => {
      if (data.data && data.data.notifyNewMessage) {
        const {
          conversationId,
          content,
          deliveredTo,
          receivers,
          index,
          seenBy,
          sender,
          isVisible,
        } = data.data.notifyNewMessage.newMessage;

        // Check if the conversationId received in the subscription equals the conversationId in the Redux state
        if (currentConversationId && conversationId === currentConversationId) {
          // Dispatch the appendMessage action to update the conversation
          dispatch(
            appendMessage({
              __typename: "Message",
              content,
              deliveredTo,
              receivers,
              index,
              seenBy,
              sender,
              isVisible,
            })
          );
        }
        // Prepare the lastMessage object based on the new message data
        const lastMessage = {
          __typename: "LastMessage",
          content,
          sender,
        };

        // Dispatch the action to update the last message of the conversation
        dispatch(updateLastMessage(conversationId, lastMessage));
      }
    },
  });

  // ACCEPTED_REQUEST_NOTIFICATION subscription
  useSubscription(ACCEPTED_REQUEST_NOTIFICATION, {
    variables: { username },
    onData: ({ data }) => {
      const acceptedRequest = data.data.acceptedRequestNotification;
      dispatch(addToContactList(acceptedRequest.receiver));
      dispatch(removePendingContactRequest(acceptedRequest.receiver));
    },
  });

  // REJECTED_REQUEST_NOTIFICATION subscription
  useSubscription(REJECTED_REQUEST_NOTIFICATION, {
    variables: { username },
    onData: ({ data }) => {
      const rejectedRequest = data.data.rejectedRequestNotification;
      dispatch(removePendingContactRequest(rejectedRequest.receiver));
    },
  });

  // This component does not render anything
  return null;
}

export default Subscriptions;
