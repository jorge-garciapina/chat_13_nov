import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useCreateConversation } from "./../graphqlOperations/convClient";

const CreateGroupConversation = ({ onConversationCreated }) => {
  const [conversationName, setConversationName] = useState("");
  const [members, setMembers] = useState([]);

  // Retrieve contactList from Redux state
  const contactList = useSelector((state) => state.userInfo.contactList);

  // Use the createConversation hook
  const { createConversation } = useCreateConversation();

  // Function to handle changes to the conversation name input
  const handleConversationNameChange = (e) => {
    setConversationName(e.target.value);
  };

  // Function to add a member from the contact list
  const addMember = (member) => {
    if (!members.includes(member)) {
      setMembers([...members, member]);
    }
  };

  // Function to remove a member from the members array
  const removeMember = (member) => {
    setMembers(members.filter((m) => m !== member));
  };

  // Function to handle the actual conversation creation
  const handleCreate = async () => {
    try {
      await createConversation({
        variables: {
          name: conversationName,
          participants: members,
          isGroupalChat: true,
        },
      });
      onConversationCreated();
    } catch (err) {
      console.error("Error executing mutation:", err);
    }
  };

  return (
    <div>
      <h2>Create a new Group Conversation</h2>
      <label>
        Conversation name:
        <input
          type="text"
          value={conversationName}
          onChange={handleConversationNameChange}
        />
      </label>
      <br />
      <div>
        <label>
          Add contacts to the conversation:
          {contactList.map((contact, index) => (
            <div key={index}>
              {contact}
              {members.includes(contact) ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removeMember(contact)}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addMember(contact)}
                >
                  Add
                </Button>
              )}
            </div>
          ))}
        </label>
      </div>
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Create
      </Button>
    </div>
  );
};

export default CreateGroupConversation;

// // import React, { useState } from "react";
// // import Button from "@mui/material/Button";
// // // Import the useCreateConversation hook from the new convClient file
// // import { useCreateConversation } from "./../graphqlOperations/convClient";

// // const CreateGroupConversation = ({ onConversationCreated }) => {
// //   // State variables for conversation name and members
// //   const [conversationName, setConversationName] = useState("");
// //   const [members, setMembers] = useState([""]);
// //   // Use the new hook for the create conversation mutation
// //   const { createConversation } = useCreateConversation();

// //   // Function to handle changes to the conversation name input
// //   const handleConversationNameChange = (e) => {
// //     setConversationName(e.target.value);
// //   };

// //   // Function to handle changes to individual member inputs
// //   const handleMemberNameChange = (index, e) => {
// //     const newMembers = [...members];
// //     newMembers[index] = e.target.value;
// //     setMembers(newMembers);
// //   };

// //   // Function to add a new member input field
// //   const addMember = () => {
// //     setMembers([...members, ""]);
// //   };

// //   // Function to handle the actual conversation creation
// //   const handleCreate = async () => {
// //     try {
// //       await createConversation({
// //         variables: {
// //           name: conversationName,
// //           participants: members.filter((member) => member.trim() !== ""),
// //           isGroupalChat: true,
// //         },
// //       });
// //       onConversationCreated();
// //     } catch (err) {
// //       console.error("Error executing mutation:", err);
// //     }
// //   };
// //   return (
// //     <div>
// //       <h2>Create a new Group Conversation</h2>
// //       <label>
// //         Conversation name:
// //         <input
// //           type="text"
// //           value={conversationName}
// //           onChange={handleConversationNameChange}
// //         />
// //       </label>
// //       <br />
// //       <label>
// //         Conversation members:
// //         {members.map((member, index) => (
// //           <div key={index}>
// //             <input
// //               type="text"
// //               value={member}
// //               onChange={(e) => handleMemberNameChange(index, e)}
// //             />
// //           </div>
// //         ))}
// //       </label>
// //       <br />
// //       <Button variant="contained" color="secondary" onClick={addMember}>
// //         Add Member
// //       </Button>
// //       <Button variant="contained" color="primary" onClick={handleCreate}>
// //         Create
// //       </Button>
// //     </div>
// //   );
// // };

// // export default CreateGroupConversation;
