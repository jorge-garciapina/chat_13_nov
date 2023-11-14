import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { useAddMessageToConversation } from "./../../graphqlOperations/convClient";

const SendMessageItem = () => {
  const [message, setMessage] = useState("");
  const conversationId = useSelector(
    (state) => state.conversation.conversationId
  );
  const addMessageToConversation = useAddMessageToConversation();

  const handleSendMessage = async () => {
    if (message.trim() && conversationId) {
      try {
        // Execute the add message function from the userClient hook
        await addMessageToConversation(conversationId, message);
        setMessage("");
      } catch (error) {
        // Handle any errors here, such as updating the UI or showing a notification
      }
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
      <TextField
        variant="outlined"
        placeholder="Type a message..."
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <Button
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
        onClick={handleSendMessage}
        disabled={!message.trim()}
      >
        Send
      </Button>
    </div>
  );
};

export default SendMessageItem;
