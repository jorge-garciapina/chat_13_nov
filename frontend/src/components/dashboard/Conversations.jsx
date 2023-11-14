// Conversations.js
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useSelector } from "react-redux";
import { useGetConversationsInfo } from "./../graphqlOperations/convClient";

const Conversations = () => {
  const username = useSelector((state) => state.userInfo.username);
  const conversations = useSelector((state) => state.conversations);

  // Using the custom hook from convClient.js to get conversation info
  const fetchConversationInfo = useGetConversationsInfo(username);

  const handleClick = (conversation) => {
    fetchConversationInfo(conversation.conversationId);
  };

  return (
    <div>
      <h1>Conversations</h1>
      <List>
        {conversations.map((conversation, index) => (
          <ListItem
            key={index}
            button
            onClick={() => handleClick(conversation)}
          >
            <ListItemText
              primary={conversation.name}
              secondary={
                conversation.lastMessage
                  ? conversation.lastMessage.content
                  : "No messages yet"
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Conversations;
