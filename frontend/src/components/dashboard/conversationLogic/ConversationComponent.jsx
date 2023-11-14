import React from "react";
import { useSelector } from "react-redux";
import { useUserStatus } from "./../../graphqlOperations/userClient";

import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";
import SendMessageItem from "./sendMessageItem";

const Conversation = () => {
  const username = useSelector((state) => state.userInfo.username);
  const interlocutors = useSelector(
    (state) => state.conversation.interlocutors
  );
  const onlineFriends = useSelector((state) => state.onlineFriends);
  const messages = useSelector((state) => state.conversation.messages);

  // Using the custom hook from userClient.js
  useUserStatus(interlocutors, username);

  return (
    <div>
      <ConversationHeader
        onlineFriends={onlineFriends}
        interlocutors={interlocutors}
        username={username}
      />
      <div className="parent-container">
        <ConversationMessages messages={messages} />
      </div>
      <SendMessageItem />
    </div>
  );
};

export default Conversation;
