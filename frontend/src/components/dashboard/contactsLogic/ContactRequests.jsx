import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import {
  useAcceptContactRequest,
  useRejectContactRequest,
} from "./../../graphqlOperations/userClient";

const ContactRequests = ({ requests }) => {
  const [clicked, setClicked] = useState(Array(requests.length).fill(false)); // Initialize all as not clicked
  const handleAcceptRequest = useAcceptContactRequest();
  const handleRejectRequest = useRejectContactRequest();

  // Function to handle accept request
  const acceptRequest = (contact, index) => {
    handleAcceptRequest(contact);
    setClicked((prevClicked) => {
      const newClicked = [...prevClicked];
      newClicked[index] = true; // Set the specific button as clicked
      return newClicked;
    });
  };

  // Function to handle reject request
  const rejectRequest = (contact, index) => {
    handleRejectRequest(contact);
    setClicked((prevClicked) => {
      const newClicked = [...prevClicked];
      newClicked[index] = true; // Set the specific button as clicked
      return newClicked;
    });
  };

  return (
    <List component="nav">
      {requests && requests.length > 0 ? (
        requests.map((contact, index) => (
          <ListItem key={index}>
            <ListItemText primary={contact} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => acceptRequest(contact, index)}
              disabled={clicked[index]} // Disable the button based on the clicked state
            >
              Accept Request
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => rejectRequest(contact, index)}
              disabled={clicked[index]} // Disable the button based on the clicked state
            >
              Reject Request
            </Button>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No contact requests available" />
        </ListItem>
      )}
    </List>
  );
};

export default ContactRequests;

// // // ContactRequests component after refactoring
// // import React from "react";
// // import List from "@mui/material/List";
// // import ListItem from "@mui/material/ListItem";
// // import ListItemText from "@mui/material/ListItemText";
// // import Button from "@mui/material/Button";
// // import {
// //   useAcceptContactRequest,
// //   useRejectContactRequest,
// // } from "./../../graphqlOperations/userClient";

// // const ContactRequests = ({ requests }) => {
// //   const handleAcceptRequest = useAcceptContactRequest();
// //   const handleRejectRequest = useRejectContactRequest();

// //   return (
// //     <List component="nav">
// //       {requests && requests.length > 0 ? (
// //         requests.map((contact, index) => (
// //           <ListItem key={index}>
// //             <ListItemText primary={contact} />
// //             <Button
// //               variant="contained"
// //               color="primary"
// //               onClick={() => handleAcceptRequest(contact)}
// //             >
// //               Accept Request
// //             </Button>
// //             <Button
// //               variant="outlined"
// //               color="secondary"
// //               onClick={() => handleRejectRequest(contact)}
// //             >
// //               Reject Request
// //             </Button>
// //           </ListItem>
// //         ))
// //       ) : (
// //         <ListItem>
// //           <ListItemText primary="No contact requests available" />
// //         </ListItem>
// //       )}
// //     </List>
// //   );
// // };

// // export default ContactRequests;
