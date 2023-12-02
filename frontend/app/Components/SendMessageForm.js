"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsername } from "@/app/Redux/userSlice";

const SendMessageForm = ({ socket, room }) => {
  const [text, setText] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesContainerRef = useRef(null);

  const username= useSelector(state => state.user.username);
  let currentUser=username
  const dispatch = useDispatch();

  useEffect(() => {
    if (messagesContainerRef.current) {
      // Scroll to the bottom when new messages are added
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  useEffect(() => {
    if (!currentUser) {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        dispatch(setUsername(storedUsername)); // Assuming you have an action to set the username
      }
    }
  }, [currentUser, dispatch]);

  const handleSendMessage = async () => {
    const currentTimestamp = new Date(Date.now());
    const formattedTimestamp = currentTimestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    if (text.trim() !== "") {
      const messageData = {
        room: room,
        text,
        username:currentUser,
        time: formattedTimestamp,
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setText("");
        try {
        // Add the message to the database
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text, time:formattedTimestamp }),
        });
  
        if (!response.ok) {
          throw new Error('Error adding message to the database');
        }
  
        // Fetch messages again to update the message list
      } catch (error) {
        console.error('Error adding message to the database:', error);
      }
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
      setText("");
    };

    if (socket) {
      socket.on("receive_message", receiveMessageHandler);
    }

    return () => {
      if (socket) {
        socket.off("receive_message", receiveMessageHandler);
      }
    };
  }, [socket]);


  useEffect(() => {
    const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:8080/api/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
  
      const data = await response.json();
      // Update state with the fetched messages
      setMessageList(data); 
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  fetchMessages()
  }, [])
  

  return (
    <>
    {messageList.length == 0 &&
    <h1 className="text-xl text-center text-blue-300">Chat room has no conversation yet.</h1>}
      <div  ref={messagesContainerRef}
        className="overflow-y-auto h-[70vh]">
        {messageList.map((message, index) => (
          <div key={index} className={message.username==currentUser?"flex flex-col mb-2 text-right mr-10 ":"flex flex-col ml-10 mb-5"}>
            <span className="font-semibold text-xl text-blue-300">{message.username===currentUser?"You":message.username}</span>
            <span className="text-xl">{message.text}</span>
            <span className="text-[11px] text-green-400">{message.time}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 mr-2 py-2 px-4 border rounded text-black"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-[#37a0a0] text-white py-2 px-4 rounded"
        >
          Send
        </button>
      </div>
    </>
  );
};

export default SendMessageForm;
