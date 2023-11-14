import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useSelector } from "react-redux"; // Import useSelector for accessing Redux state
import {
  useCreateConversation,
  useGetConversationsInfo,
} from "./../../graphqlOperations/convClient"; // Import the useCreateConversation hook

const ContactList = ({ contacts }) => {
  // Extract username from Redux state
  const username = useSelector((state) => state.userInfo.username);
  const conversations = useSelector((state) => state.conversations);

  // Using the custom hook from convClient.js to get conversation info
  const fetchConversationInfo = useGetConversationsInfo(username);

  // Use the createConversation hook
  const { createConversation } = useCreateConversation();

  // Function to handle list item click
  const handleListItemClick = async (contactUsername) => {
    try {
      const filterConversation = conversations.filter((conversation) => {
        // To filter the oneToOne Chat where contactUsername is the interlocutor:
        return (
          !conversation.isGroupalChat &&
          conversation.participants.indexOf(contactUsername) !== -1
        );
      });

      if (!filterConversation[0]) {
        // Create a conversation with the contactUsername and username
        await createConversation({
          variables: {
            name: "oneToOneConversation",
            participants: [username, contactUsername],
            isGroupalChat: false,
          },
          onCompleted: (data) => {
            const conversationId = data.createConversation.conversationId;
            fetchConversationInfo(conversationId);
          },
        });
      } else {
        fetchConversationInfo(filterConversation[0].conversationId);
      }
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  return (
    <List component="nav">
      {contacts && contacts.length > 0 ? (
        contacts.map((contact, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleListItemClick(contact)}
          >
            <ListItemText primary={contact} />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No contacts available" />
        </ListItem>
      )}
    </List>
  );
};

export default ContactList;
