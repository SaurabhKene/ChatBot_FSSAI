import React, { useState, useRef, useEffect } from "react";
import botImg from "../assest/Images/chaticon2.png";
import "../assest/css/popupstyle.css"; // Make sure this file contains all your CSS
//import CryptoJS from "crypto-js";

// Function to decrypt the token
// function serviceResponseDecrypt(encryptedValue) {
//   const encryptedBase64Key = "bXVzdGJlMTZieXRlc2tleQ=="; // Base64 key
//   const parsedBase64Key = CryptoJS.enc.Base64.parse(encryptedBase64Key); // Parse the Base64 key
//   const encryptedCipherText = encryptedValue; // Encrypted token

//   // Decrypt the data
//   const decryptedData = CryptoJS.AES.decrypt(
//     encryptedCipherText,
//     parsedBase64Key,
//     {
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7,
//     }
//   );

//   // Return the decrypted value as a UTF-8 string
//   return decryptedData.toString(CryptoJS.enc.Utf8);
// }

// Encrypted token
// const encryptedToken =
//   "VT0gLlseURE4OsbIPQttS0RC+PkCzzVCGw0a1PFQvWOF/K4zotkyuPj+p3fFW2NZeCTmePasTOoElG86l8tQ0k0jJLS6KxH/reHoe0trDoU9CTkIiTQJwwGkXul6C0ArLaPhSn/copHAaMnWMj/R1MAz4R5NqNJ0fG4QMsbWyUk/o6HFhjg2zZEagS48Y1L1Skb2XAkSyNlZKfSV0qRdEg==";

// // Decrypt the token
// const decryptedValue = serviceResponseDecrypt(encryptedToken);

// // Log the decrypted value
// console.log("Decrypted Value:", decryptedValue);

const queryParams = new URLSearchParams(window.location.search);
const modelString = queryParams.get("model");
var modelObject;
if (modelString) {
  try {
    // Decode and parse the JSON string
    modelObject = JSON.parse(decodeURIComponent(modelString));

    // Log the parsed object
    console.log("Model Object:", modelObject);

    // Access individual values
    console.log("Id:", modelObject.clientid);
    console.log("Name:", modelObject.clientname);
    console.log("BotName:", modelObject.clientbotname);
    console.log("ExpDate:", modelObject.exprydate);
    console.log("Nickname:", modelObject.activeflag);
  } catch (error) {
    console.error("Error parsing model JSON:", error.message);
  }
} else {
  console.error("No model parameter found in the URL.");
}

function ChatPopup({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const [threadId, setThreadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${minutesFormatted}:${secondsFormatted} ${period}`;
  };

  const handleButtonClic = (action) => {
    const status = checkUserStatus();

    if (!status.isValid) {
      // Append the error message directly to the messages array
      const currentTime = getCurrentTime();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: status.message,
          sender: "Bot",
          time: currentTime,
          style: { color: "red", fontSize: "20px" },
        },
      ]);
      return; // Terminate the function
    }
    if (action === "trackApplication") {
      setMessages((prev) => [
        ...prev,
        {
          text: "Application Tracking", // Now, `text` is an array of strings and JSX
          sender: "You",
          time: getCurrentTime(),
        },
      ]);
      const newMessage = (
        <div
          className="messageContainer theirMessageContainer"
          key={Date.now()}
        >
          <img src={botImg} alt="Bot Avatar" className="avatar" />
          <div className="message theirMessage">
            <span className="text">
              Please select one of the options below:
            </span>
            <div className="buttonsContainer">
              <button
                className="button"
                onClick={() => handleTAClick("trackApplication")}
              >
                Track Application
              </button>
              <button
                className="button"
                onClick={() => handleButtonClickMenu("Complaint Status")}
              >
                Complaint Status
              </button>
              <button
                className="button"
                onClick={() => handleButtonClickMenu("Know Your Officer")}
              >
                Know Your Officer
              </button>
              <button
                className="button"
                onClick={() => handleButtonClickMenu("FBO Search")}
              >
                FBO Search
              </button>
            </div>
            <div className="time">{getCurrentTime()}</div>
          </div>
        </div>
      );
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Append to the message list
    } else if (action === "generalQuery") {
      // Example: Add a general query response
      const newMessage = (
        <div
          className="messageContainer theirMessageContainer"
          key={Date.now()}
        >
          <img src={botImg} alt="Bot Avatar" className="avatar" />
          <div className="message theirMessage">
            <span className="text">
              You selected a General Query. Please write your query in the text
              box below.
            </span>
            <div className="time">{getCurrentTime()}</div>
          </div>
        </div>
      );
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };
  const handleButtonClickMenu = (buttonName) => {
    const responseMessage = (
      <div className="messageContainer myMessageContainer" key={Date.now()}>
        {/* <img src={botImg} alt="Bot Avatar" className="avatar" /> */}
        <div className="message myMessage">
          <span className="text"> {buttonName}</span>
          <div className="time">{getCurrentTime()}</div>
        </div>
      </div>
    );
    setMessages((prevMessages) => [...prevMessages, responseMessage]);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTAClick = (action) => {
    if (action === "trackApplication") {
      const newMessage = (
        <div
          className="messageContainer theirMessageContainer"
          key={Date.now()}
        >
          <img src={botImg} alt="Bot Avatar" className="avatar" />
          <div className="message theirMessage">
            <span className="text">
              Please enter your Application Tracking ID:
            </span>
            <div className="inputContainer">
              <input className="customInput" ref={inputRef} type="text" />
              <button
                className="button"
                onClick={() => handleButtonClickTA("Get Status")}
              >
                Get Application Status
              </button>
            </div>
            <div className="time">{getCurrentTime()}</div>
          </div>
        </div>
      );
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  const handleButtonClickTA = (action) => {
    const trackingId = inputRef.current.value;
    if (action === "Get Status") {
      console.log(trackingId + "hello"); // Check inputTA value in the console

      if (!trackingId) {
        alert("Please enter your Application Tracking ID.");
        return;
      }

      const apiUrl = `https://fctest.fssai.gov.in/gateway/commonauth/commonapi/gettrackapplicationdetails/${trackingId}`;

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
          const applicationData = data[0]; // Assuming the API returns an array

          // Prepare message text as an array
          const messageText = [
            <strong>Application Status:</strong>,
            ` ${applicationData.statusDesc || "Unknown"}`,
            <br />,
            <strong>Company Name:</strong>,
            ` ${applicationData.companyName || "Not Available"}`,
            <br />,
            <strong>License Category:</strong>,
            ` ${applicationData.licenseCategoryName || "Not Available"}`,
            <br />,
            <strong>Address:</strong>,
            ` ${applicationData.addressPremises || "Not Available"}`,
            <br />,
            <strong>District:</strong>,
            ` ${applicationData.districtName || "Not Available"}`,
            <br />,
            <strong>State:</strong>,
            ` ${applicationData.stateName || "Not Available"}`,
            <br />,
            <strong>Pincode:</strong>,
            ` ${applicationData.premisePincode || "Not Available"}`,
            <br />,
            <strong>Application Type:</strong>,
            ` ${applicationData.apptypeDesc || "Not Available"}`,
            <br />,
            <strong>Submission Date:</strong>,
            ` ${applicationData.appSubmissionDate || "Not Available"}`,
          ];

          setMessages((prev) => [
            ...prev,
            {
              text: messageText,
              sender: "Bot",
              time: getCurrentTime(),
            },
          ]);
        })
        .catch((error) => {
          console.log(error);

          const errorMessageText = [
            "Error: Unable to retrieve the application status. Please try again later.",
          ];

          setMessages((prev) => [
            ...prev,
            {
              text: errorMessageText,
              sender: "Bot",
              time: getCurrentTime(),
            },
          ]);
        });
    }
  };
  const user = {
    isActive: true,
    subscriptionDate: "2025-01-21",
  };

  const checkUserStatus = () => {
    setMessages([
      ...messages,
      { text: input, sender: "You" },
    ]);
    const currentDate = new Date();
    const subscriptionEndDate = new Date(user.subscriptionDate);

    if (!user.isActive) {
      return {
        isValid: false,
        message: "User is inactive. Please contact support.",
      };
    }

    if (subscriptionEndDate < currentDate) {
      return {
        isValid: false,
        message:
          "Your subscription is expired. Please renew your subscription.",
      };
    }
    setInput("");
    return { isValid: true };
  };
  const handleSend = async () => {
    const status = checkUserStatus();

    if (!status.isValid) {
      // Append the error message directly to the messages array
      const currentTime = getCurrentTime();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: status.message,
          sender: "Bot",
          time: currentTime,
          style: { color: "red", fontSize: "20px" },
        },
      ]);
      setInput("");
      return; // Terminate the function
    }
    if (input.trim()) {
      const currentTime = getCurrentTime();
      setMessages([
        ...messages,
        { text: input, sender: "You", time: currentTime },
      ]);

      try {
        setInput("");
        setIsLoading(true);
        const response = await fetch(
          "http://qms.digital.logicsoft.online:8081/gateway/chatbot/bot/process",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              threadId: threadId,
              chatInput: input,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const receiverTime = getCurrentTime();

        setThreadId(data.threadId);

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.response, sender: "Bot", time: receiverTime },
        ]);
      } catch (error) {
        console.error("Error fetching chatbot response:", error.message);

        const receiverTime = getCurrentTime();
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, something went wrong. Please try again later.",
            sender: "Bot",
            time: receiverTime,
          },
        ]);
      } finally {
        setInput("");
        setIsLoading(false);
      }
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

        <div className="chatBox" ref={chatBoxRef}>
          {/* Initial hardcoded message */}
          <div className="messageContainer theirMessageContainer">
            <img src={botImg} alt="Bot Avatar" className="avatar" />
            <div className="message theirMessage">
              <span className="text">
                Hello! Welcome to FSSAI! How can I assist you today?
              </span>
              <div className="buttonsContainer">
                <button
                  className="button"
                  onClick={() => handleButtonClic("generalQuery")}
                >
                  General Query
                </button>
                <button
                  className="button"
                  onClick={() => handleButtonClic("trackApplication")}
                >
                  Track Application/Complaint/FBO
                </button>
              </div>
            </div>
          </div>
          {messages.map((message, index) => {
            // Check if `message` is a JSX element
            if (React.isValidElement(message)) {
              return React.cloneElement(message, { key: index });
            }
            return (
              <div
                className={`messageContainer ${
                  message.sender === "You"
                    ? "myMessageContainer"
                    : "theirMessageContainer"
                }`}
                key={index}
                style={message.style || {}}
              >
                {message.sender === "Bot" && (
                  <img src={botImg} alt="Bot Avatar" className="avatar" />
                )}
                <div
                  className={`message ${
                    message.sender === "You" ? "myMessage" : "theirMessage"
                  }`}
                >
                  {Array.isArray(message.text)
                    ? message.text.map((item, idx) => (
                        <span key={idx}>{item}</span>
                      ))
                    : message.text}
                  <div className="time">{message.time}</div>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="messageContainer theirMessageContainer">
              <img src={botImg} alt="Bot Avatar" className="avatar" />
              <div className="">
                <div class="chatbot-loading">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>{" "}
              </div>
            </div>
          )}
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
