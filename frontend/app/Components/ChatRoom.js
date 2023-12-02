"use client"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import SendMessageForm from './SendMessageForm';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import messageLogo from "../../public/Images/messageLogo.svg"

const ChatRoom = () => {
  const router = useRouter();

  const [socket, setSocket] = useState(null);
  let room="room123"

  useEffect(() => {
    const token= localStorage.getItem("token")
    const user= localStorage.getItem("username")

    if(!token || !user){
      router.push("/login")
    }
  }, [])


  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    newSocket.emit("join_room",room)
    setSocket(newSocket);  
  }, []);

 
  useEffect(() => {
    if(socket){
      console.log("Connected!")
    }
  }, [])

  const handleLogout=()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    router.push("/login")
  }

  return (
    <div className="flex flex-col h-screen bg-[#2B3137]">
      <div className="bg-[#2B3137] text-white flex justify-between ml-5 mt-10 mb-10">
        <div className='flex ml-5'>
    <Image src={messageLogo} width={50} height={50} alt='logo'/>
        <h1 className="text-3xl font-bold ml-5 font-mono">Chat Room</h1>
        </div>
        <button className="text-lg rounded-xl font-semibold w-32 h-10 shadow-[-6px_4px_30px_rgb(0,0,0,0.75)]  bg-red-500 mr-[5%] hover:bg-red-600"
        onClick={handleLogout}>Logout</button>
      </div>
      {/* <div className="flex-1 p-4 overflow-y-auto bg-[#2B3137]">
     
      </div> */}
      <div className="mx-10">
        {socket && <SendMessageForm socket={socket} room={room} />}
      </div>
    </div>
  );
};

export default ChatRoom;
