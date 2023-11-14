// Import necessary hooks from Apollo Client
import { useMutation } from "@apollo/client";
// Import the CREATE_CONVERSATION mutation from the conversationClient file
import {
  CREATE_CONVERSATION,
  ADD_MESSAGE_TO_CONVERSATION,
  getDynamicConversationInfoQuery,
} from "./../../graphql/conversationClient";

import { useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import {
  defineInterlocutors,
  updateMessages,
  setSelectedConversationId,
} from "./../../redux/actions";

// Export a function that wraps the useMutation hook for the CREATE_CONVERSATION mutation
export function useCreateConversation() {
  // Initialize the mutation hook and return it along with any associated data, loading, and error states
  const [createConversation, { data, loading, error }] =
    useMutation(CREATE_CONVERSATION);

  return {
    createConversation,
    data,
    loading,
    error,
  };
}

export const useAddMessageToConversation = () => {
  const [addMessageMutation] = useMutation(ADD_MESSAGE_TO_CONVERSATION);

  const addMessageToConversation = async (conversationId, message) => {
    try {
      await addMessageMutation({
        variables: {
          conversationId,
          content: message,
        },
      });
      // You might want to dispatch an action to update the conversation messages in the Redux store or handle the update via the mutation response
    } catch (error) {
      console.error("Error sending message:", error);
      throw error; // Re-throw the error if you want to handle it in the component
    }
  };

  return addMessageToConversation;
};

// Constants for the dynamic query fields
const PARTICIPANTS_FIELD = "participants";
const MESSAGES_FIELD =
  "messages {content deliveredTo receivers index seenBy sender isVisible}";

export const useGetConversationsInfo = (username) => {
  const dispatch = useDispatch();
  // We assume getDynamicConversationInfoQuery is a function that constructs the query dynamically
  const getParticipantsAndMessagesQuery = getDynamicConversationInfoQuery([
    PARTICIPANTS_FIELD,
    MESSAGES_FIELD,
  ]);

  const [getConversationInfo] = useLazyQuery(getParticipantsAndMessagesQuery, {
    onCompleted: (data) => {
      const { participants, messages } = data.getConversationInfo;
      const filteredParticipants = participants.filter((p) => p !== username);

      dispatch(defineInterlocutors(filteredParticipants));
      dispatch(updateMessages(messages));
    },
    onError: (error) => {
      console.error("Error fetching conversation info:", error);
    },
  });

  // This function will be called with a conversationId when a conversation list item is clicked
  const fetchConversationInfo = (conversationId) => {
    getConversationInfo({
      variables: { conversationId },
    });
    dispatch(setSelectedConversationId(conversationId));
  };

  return fetchConversationInfo;
};
