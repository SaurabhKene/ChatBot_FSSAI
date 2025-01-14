import React, { useState } from "react";
import ChatPopup from "./component/ChatPopup";
import DemoComp from "./component/DemoComp";
import BotIcon from "./component/ChatButton";
//import CSS from "./App.css";

function App(props) {
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Function to open the chat popup
  const openChatPopup = () => setIsChatOpen(true);

  // Function to close the chat popup
  const closeChatPopup = () => setIsChatOpen(false);

  return (
    <>
      <React.StrictMode>
        <DemoComp />
      </React.StrictMode>
      <BotIcon onClick={openChatPopup} />
      <div>
        {/* Button to open chat popup */}
        <button
          onClick={openChatPopup}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "190px",
            padding: "15px 20px",
            borderRadius: "50%",
            backgroundColor: "#007BFF",
            color: "white",
            fontSize: "20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          ChatBot
        </button>

        {/* ChatPopup component */}
        <ChatPopup isOpen={isChatOpen} onClose={closeChatPopup} />
      </div>
    </>
  );
}

export default App;
