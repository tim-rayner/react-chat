import io from "socket.io-client";

import "./App.css";
import { useEffect, useState } from "react";
import Message from "./components/molecules/Message";

const socket = io("http://localhost:5000");

type Message = {
  username: string;
  text: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }, []);

  useEffect(() => {
    socket.on("message", (message: Message) => {
      message.username = message.username || "Anonymous";
      setMessages([...messages, message]);
    });
  }, [messages]);

  function sendMessage() {
    if (messageText === "") {
      return;
    }

    socket.emit("sendMessage", { text: messageText });
    setMessageText("");
  }

  return (
    <div className="App">
      <h1>Real-Time Chat App</h1>
      <div className="messages">
        {messages.map((message, index) => (
          <Message
            key={index}
            username={message.username}
            text={message.text}
          />
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
