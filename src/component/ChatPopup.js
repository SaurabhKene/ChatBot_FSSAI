import React, { useState, useRef, useEffect } from "react";
import fssaiImage from "../Images/fssai.png";
import botImg from "../Images/chaticon2.png";
const queryParams = new URLSearchParams(window.location.search);
const model = queryParams.get("model");

function ChatPopup({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);

  // Function to get current time formatted as HH:MM AM/PM
  const getCurrentTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    //const seconds = date.getSeconds(); // Get seconds
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    //const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds; // Format seconds
    //return `${hours}:${minutesFormatted}:${secondsFormatted} ${period}`;
    return `${hours}:${minutesFormatted} ${period}`;
  };

  // Automatically scroll to the bottom when a new message is added
  useEffect(() => {
    // Scroll to the bottom of the chatbox whenever the messages state changes
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Load a default image and message when the chatbot opens
    if (isOpen) {
      setMessages([
        {
          text: "Hello! Welcome to FSSAI! How can I assist you today?",
          sender: "Bot",
          time: getCurrentTime(),
        },
      ]);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (input.trim()) {
      // Add a new message from the sender (You)
      const currentTime = getCurrentTime();
      setMessages([
        ...messages,
        { text: input, sender: "You", time: currentTime },
      ]);
      setInput("");

      // Simulate a receiver response
      setTimeout(() => {
        const receiverTime = getCurrentTime();
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Welcome to FSSAI! I am the Food Safety and Standards Authority of India (FSSAI) Health Assistant (FSHA) Chatbot, your personal assistant here to help with any FSSAI-related queries. Feel free to ask me more by choosing one of the options below. I am here to assist you on your export journey.   This is a static response. It is not provided by the chatbot because there is no API connected on the backend of the chatbot.  ${model}`,
            sender: "Receiver",
            time: receiverTime,
          },
        ]);
      }, 4000); // Add a delay for the receiver's response
    }
  };
  return (
    isOpen && (
      <div style={styles.popupContainer}>
        <div></div>
        <div style={styles.popupHeader}>
          <div style={styles.greeting}>
            <p>Hi !</p>
          </div>
          <div style={styles.description}>
            <p>
              Welcome to FSSAI! I am Food Safety Health Assistant (FSHA)
              Chatbot, your personal assistant here to help with any
              FSSAI-related queries. Feel free to ask me more by choosing one of
              the options below. I am here to assist you on your export journey.
            </p>
          </div>
          <button style={styles.closeButton} onClick={onClose}></button>
        </div>

        <div ref={chatBoxRef} style={styles.chatBox}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                ...styles.messageContainer,
                ...(message.sender === "You"
                  ? styles.myMessageContainer
                  : styles.theirMessageContainer),
              }}
            >
              {/* Sender's Image */}
              {message.sender !== "You" && (
                <img
                  src={botImg} // Replace with an image specific to the sender if needed
                  alt={`${message.sender} avatar`}
                  style={styles.avatar}
                />
              )}
              {/* Message Content */}
              <div
                style={{
                  ...styles.message,
                  ...(message.sender === "You"
                    ? styles.myMessage
                    : styles.theirMessage),
                }}
              >
                <span style={styles.text}>{message.text}</span>
                <div style={styles.time}>{message.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            style={styles.input}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button style={styles.button} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    )
  );
}

const styles = {
  popupContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 0,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 999,
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  optionButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#ff5e04",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },
  welcomeMessage: {
    marginTop: "10px",
    fontSize: "14px",
    lineHeight: "1.5",
    textAlign: "justify",
  },
  popupHeader: {
    padding: "10px",
    backgroundColor: "#ff5e04",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    borderBottom: "1px solid #ccc",
  },
  greeting: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "white",
  },
  description: {
    fontSize: "13px",
    lineHeight: "1.4",
    marginBottom: "4px",
    margin: "2px",
    color: "white",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "transparent",
    border: "none",
    color: "#ffffff",
    fontSize: "10px",
    cursor: "pointer",
    padding: "0",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.8)), url(${fssaiImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  messageContainer: {
    display: "flex", // Align items horizontally
    alignItems: "flex-start", // Align items at the top
    margin: "10px 10px", // Add spacing between messages
  },
  myMessageContainer: {
    flexDirection: "row-reverse", // Reverse the direction for user messages
  },
  theirMessageContainer: {
    flexDirection: "row", // Default direction for bot/receiver messages
  },
  avatar: {
    width: "40px",
    height: "50  px",
    borderRadius: "50%",
    margin: "0 5px", // Space between the image and message content
  },
  message: {
    padding: "5px 10px",
    borderRadius: "10px",
    maxWidth: "80%",
    wordWrap: "break-word",
    whiteSpace: "pre-wrap",
    position: "relative",
  },
  myMessage: {
    backgroundColor: "#d1ffd6",
    textAlign: "right",
  },
  theirMessage: {
    backgroundColor: "#f1f0f0",
    textAlign: "left",
  },
  text: {
    fontSize: "0.9em",
    color: "#000",
  },
  time: {
    fontSize: "0.6em",
    color: "#777",
    textAlign: "right",
    marginTop: "5px",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#ff5e04",
    color: "white",
    cursor: "pointer",
  },
};

export default ChatPopup;