import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:5000");

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [entered, setEntered] = useState(false); 
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);
const onEmojiClick = (emojiData) => {
  setMessage((prev) => prev + emojiData.emoji);
};
  const sendMessage = () => {
    if (message.trim() === "") return;

    const data = {
      name,
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", data);
    setMessage("");
  };

  if (!entered) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Welcome to Chat App 💬</h2>
        <input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px" }}
        />
        <br /><br />
        <button onClick={() => setEntered(true)}>Start Chat</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f2f2f2", height: "100vh" }}>
      <h2 style={{ textAlign: "center" }}>Chat App 💬</h2>

      <div style={{ maxWidth: "400px", margin: "auto" }}>
        {chat.map((c, index) => (
          <div
            key={index}
            style={{
              textAlign: c.name === name ? "right" : "left",
              margin: "10px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: c.name === name ? "#4CAF50" : "#ddd",
                color: c.name === name ? "white" : "black",
              }}
            >
              <b>{c.name}</b>: {c.message}
              <br />
              <small>{c.time}</small>
            </span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: "10px", width: "60%" }}
        />
        <button onClick={() => setShowPicker(!showPicker)}>
  😊
</button>
{showPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
        <button
          onClick={sendMessage}
          style={{
            padding: "10px",
            marginLeft: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;