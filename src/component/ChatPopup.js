import React, { useState, useRef, useEffect } from "react";
import botImg from "../assest/Images/chaticon2.png";
import "../assest/css/popupstyle.css"; // Make sure this file contains all your CSS

const queryParams = new URLSearchParams(window.location.search);
const model = queryParams.get("model");

function ChatPopup({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Update state with the input value
  };
  const getCurrentTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesFormatted} ${period}`;
  };

  // Automatically scroll to the bottom when a new message is added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          text: "Hello! Welcome to FSSAI! How can I assist you today?",
          sender: "Bot",
          buttons: [
            { text: "General Query", action: "generalQuery" },
            {
              text: "Track Application/Complaint/FBO",
              action: "trackApplication",
            },
          ],
          time: getCurrentTime(),
        },
      ]);
    }
  }, [isOpen]);

  const handleButtonClick = (action, inputValue) => {
    if (action === "generalQuery") {
      setMessages((prev) => [
        ...prev,
        {
          text: "You selected a General Query. Please write your query in the text box below.",
          sender: "Bot",
          time: getCurrentTime(),
        },
      ]);
    } else if (action === "trackApplication") {
      setMessages((prev) => [
        ...prev,
        {
          text: "Track Application/Complaint/FBO",
          sender: "You", // Message from user
          time: getCurrentTime(),
        },
        {
          text: "Please select one of the below options:",
          sender: "Bot",
          buttons: [
            { text: "Track Application", action: "TA" },
            { text: "Complaint Status", action: "Complaint Status" },
            { text: "Know Your Officer", action: "Know Your Officer" },
            { text: "FBO Search", action: "FBO Search" },
          ],
          time: getCurrentTime(),
        },
      ]);
    } else if (action === "TA") {
      setMessages((prev) => [
        ...prev,
        {
          text: "Please Enter your Application tracking id",
          sender: "Bot",
          input: [
            {
              placeholder: "Enter Your tracking Id",
              type: "text",
            },
          ],
          buttons: [
            {
              text: "Get Application Status",
              action: "Get Status",
              onClick: (index) => handleButtonClickTA("Get Status", index), // Pass index to the handler
            },
          ],
          time: getCurrentTime(),
        },
      ]);
    } else if (action === "Complaint Status") {
      setMessages((prev) => [
        ...prev,
        {
          text: "Please Enter Your Complaint No.",
          sender: "Bot",
          input: [
            {
              placeholder: "Enter Your Complaint No.",
              type: "text",
            },
          ],
          buttons: [
            {
              text: "Get Complaint Status",
              action: "Get Complaint Status",
            },
          ],
          time: getCurrentTime(),
        },
      ]);
    } else if (action === "Get Status") {
      handleButtonClickTA(action);
    } else if (action === "Get Complaint Status") {
      //handleButtonClickCS(action);
    }
  };
  const handleButtonClickTA = (action) => {
    if (action === "Get Status") {
      const trackingIdValue = inputValue;
      console.log(trackingIdValue);

      if (!trackingIdValue) {
        alert("Please enter your Application Tracking ID.");
        return;
      }

      const apiUrl = `https://fctest.fssai.gov.in/gateway/commonauth/commonapi/gettrackapplicationdetails/${trackingIdValue}`;

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch application status.");
          }
          return response.json();
        })
        .then((data) => {
          const applicationData = data[0]; // Assuming the API returns an array and we need to access the first object

          setMessages((prev) => [
            ...prev,
            {
              text:
                `Application Status: ${
                  applicationData.statusDesc || "Unknown"
                }\n` +
                `Company Name: ${
                  applicationData.companyName || "Not Available"
                }\n` +
                `License Category: ${
                  applicationData.licenseCategoryName || "Not Available"
                }\n` +
                `Address: ${
                  applicationData.addressPremises || "Not Available"
                }\n` +
                `District: ${
                  applicationData.districtName || "Not Available"
                }\n` +
                `State: ${applicationData.stateName || "Not Available"}\n` +
                `Pincode: ${
                  applicationData.premisePincode || "Not Available"
                }\n` +
                `Application Type: ${
                  applicationData.apptypeDesc || "Not Available"
                }\n` +
                `Submission Date: ${
                  applicationData.appSubmissionDate || "Not Available"
                }`,
              sender: "Bot",
              time: getCurrentTime(),
            },
          ]);
        })
        .catch((error) => {
          console.log(error);
          setMessages((prev) => [
            ...prev,
            {
              text: `Error: Unable to retrieve the application status. Please try again later.`,
              sender: "Bot",
              time: getCurrentTime(),
            },
          ]);
        });
    }
  };

  const handleSend = () => {
    if (input.trim()) {
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
            text: `Welcome to FSSAI! I am the Food Safety and Standards Authority of India (FSSAI) Health Assistant (FSHA) Chatbot, your personal assistant here to help with any FSSAI-related queries. Feel free to ask me more by choosing one of the options below. I am here to assist you on your export journey. This is a static response. It is not provided by the chatbot because there is no API connected on the backend of the chatbot. ${model}`,
            sender: "Receiver",
            time: receiverTime,
          },
        ]);
      }, 4000);
    }
  };

  return (
    isOpen && (
      <div className="popupContainer">
        <div></div>
        <div className="popupHeader">
          <div className="greeting">
            <p>Hi !</p>
          </div>
          <div className="description">
            <p>
              Welcome to FSSAI! I am Food Safety Health Assistant (FSHA)
              Chatbot, your personal assistant here to help with any
              FSSAI-related queries. Feel free to ask me more by choosing one of
              the options below. I am here to assist you on your export journey.
            </p>
          </div>
          <button className="closeButton" onClick={onClose}></button>
        </div>
        <div ref={chatBoxRef} className="chatBox">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`messageContainer ${
                message.sender === "You"
                  ? "myMessageContainer"
                  : "theirMessageContainer"
              }`}
            >
              {message.sender !== "You" && (
                <img
                  src={botImg}
                  alt={`${message.sender} avatar`}
                  className="avatar"
                />
              )}
              <div
                className={`message ${
                  message.sender === "You" ? "myMessage" : "theirMessage"
                }`}
              >
                <span className="text">{message.text}</span>
                <div className="time">{message.time}</div>

                {message.input && (
                  <div className="inputContainer">
                    {message.input.map((inputField, idx) => (
                      <div key={idx} className="inputWrapper">
                        <input
                          type={inputField.type}
                          placeholder={inputField.placeholder}
                          className="customInput"
                          value={inputValue}
                          onChange={handleInputChange}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {message.buttons && (
                  <div className="buttonsContainer">
                    {message.buttons.map((button, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          // Check if there is an input field above the button
                          const inputField = document.querySelector(
                            `#inputField-${idx}`
                          );
                          const inputValue = inputField ? inputField.value : "";
                          handleButtonClick(button.action, inputValue);
                        }}
                        className="button"
                      >
                        {button.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="inputContainer">
          <input
            type="text"
            className="input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="buttonSend" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    )
  );
}
export default ChatPopup;
