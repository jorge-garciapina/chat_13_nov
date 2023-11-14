import { useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { updateUserInfo } from "./../../redux/actions";

import {
  INFO_QUERY,
  SEARCH_USERS,
  SEND_CONTACT_REQUEST,
  CANCEL_CONTACT_REQUEST,
  ACCEPT_CONTACT_REQUEST_MUTATION,
  REJECT_CONTACT_REQUEST_MUTATION,
  GET_USER_STATUS_QUERY,
} from "./../../graphql/userQueries";

import { useMutation } from "@apollo/client";
import {
  cancelContactRequest,
  updatePendingContactRequests,
  removeContactRequest,
  addToContactList,
  interlocutorIsOnline,
} from "./../../redux/actions";

// Custom hook for fetching and dispatching user info
export const useUserInfo = () => {
  const dispatch = useDispatch();

  const { loading, error } = useQuery(INFO_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      const username = data?.userInfo?.username;
      const contactList = data?.userInfo?.contactList;
      const conversations = data?.userInfo?.conversations || [];
      const receivedContactRequests = data.userInfo.receivedContactRequests.map(
        (request) => request.sender
      );
      const pendingContactRequests = data.userInfo.pendingContactRequests.map(
        (request) => request.receiver
      );

      const { oneToOneChats } = conversations.reduce(
        (acc, chat) => {
          if (!chat.isGroupalChat) {
            acc.oneToOneChats.push(chat);
          }
          return acc;
        },
        { oneToOneChats: [] }
      );

      oneToOneChats.forEach((chat) => {
        const interlocutor = chat.participants.filter((participant) => {
          return participant !== username;
        })[0];
        // THIS CHANGES THE NAME IN THE conversations ARRAY, NO NEED OF MORE OPERATIONS
        chat.name = interlocutor;
      });

      // Dispatching action to update the user info in Redux store
      dispatch(
        updateUserInfo(
          username,
          contactList,
          receivedContactRequests,
          conversations,
          pendingContactRequests
        )
      );
    },
    onError: (error) => {
      console.error("Error in fetching user info:", error);
    },
  });

  return { loading, error };
};

export const useUserSearch = () => {
  const [executeSearch, { data, loading, error }] = useLazyQuery(SEARCH_USERS);

  return {
    executeSearch,
    searchData: data,
    searchLoading: loading,
    searchError: error,
  };
};

export const useSendContactRequest = (pendingContactRequests, username) => {
  const dispatch = useDispatch();
  const [sendContactRequest, { loading: sending }] = useMutation(
    SEND_CONTACT_REQUEST,
    {
      onCompleted: () => {
        dispatch(
          updatePendingContactRequests([...pendingContactRequests, username])
        );
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return {
    sendContactRequest: (receiverUsername) =>
      sendContactRequest({ variables: { receiverUsername } }),
    sending,
  };
};

export const useCancelContactRequest = (username) => {
  const dispatch = useDispatch();
  const [cancelRequest, { loading: cancelling }] = useMutation(
    CANCEL_CONTACT_REQUEST,
    {
      onCompleted: () => {
        dispatch(cancelContactRequest(username));
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return {
    cancelRequest: (receiverUsername) =>
      cancelRequest({ variables: { receiverUsername } }),
    cancelling,
  };
};

export const useAcceptContactRequest = () => {
  const dispatch = useDispatch();
  const [acceptContactRequestMutation] = useMutation(
    ACCEPT_CONTACT_REQUEST_MUTATION
  );

  const handleAcceptRequest = (username) => {
    return acceptContactRequestMutation({
      variables: { senderUsername: username },
    }).then(() => {
      dispatch(removeContactRequest(username));
      dispatch(addToContactList(username));
    });
  };

  return handleAcceptRequest;
};

export const useRejectContactRequest = () => {
  const dispatch = useDispatch();
  const [rejectContactRequestMutation] = useMutation(
    REJECT_CONTACT_REQUEST_MUTATION
  );

  const handleRejectRequest = (username) => {
    return rejectContactRequestMutation({
      variables: { senderUsername: username },
    }).then(() => {
      dispatch(removeContactRequest(username));
    });
  };

  return handleRejectRequest;
};

export const useUserStatus = (interlocutors, username) => {
  const dispatch = useDispatch();

  useQuery(GET_USER_STATUS_QUERY, {
    skip: !interlocutors || interlocutors.length === 0,
    variables: { usernames: interlocutors },
    onCompleted: (data) => {
      if (data.getUserStatuses) {
        data.getUserStatuses.forEach((statusObj) => {
          if (statusObj.onlineStatus && statusObj.username !== username) {
            dispatch(interlocutorIsOnline(statusObj.username));
          }
        });
      }
    },
    onError: (error) => {
      console.error("Error fetching user statuses:", error);
    },
  });
};
