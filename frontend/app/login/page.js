"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "../Components/Footer";
import { useRouter } from "next/navigation";
import { setUsername } from "@/app/Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  //const username= useSelector(state => state.user.username);
  const dispatch = useDispatch();

    const openSignUp=()=>{
        router.push("/signup")
    }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        response
          .json()
          .then((data) => {
            dispatch(setUsername(data.user.username))
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            router.push("/chat");
          })
          .catch((error) => {
            console.error("Error parsing JSON response:", error);
          });
      } else {
        response
          .json()
          .then((data) => {
            const successMessage = data.message;
            setError(successMessage);
          })
          .catch((error) => {
            console.error("Error parsing JSON response:", error);
          });
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center h-[100vh] items-center gap-5 bg-[#2B3137] rounded p-1 lg:p-4 ">
        <h1 className="block text-white text-3xl lg:text-4xl mb-2 font-bold">
          Login
        </h1>
        <div>
          {error && (
            <div className="flex justify-center items-center h-10">
              <p className="font-bold text-red-500 ml-5">{error}</p>
            </div>
          )}

          <p className="text-white text-lg  ">Email</p>
          <input
            type="email"
            className="w-[300px] h-10 text-lg  p-1 rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <p className="text-white text-lg ">Password</p>
          <input
            type="password"
            className="rounded w-[300px] text-lg h-10 p-1 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a
            href="/forget"
            className=" block text-white text-[14px] lg:text-sm text-right"
          >
            Forgot Password?
          </a>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#d66e6e] h-10 text-lg px-[70px] py-1 lg:px-16 rounded text-white"
        >
          Sign in
        </button>

        <div className="flex flex-row">
          <hr className="border-t border-white w-12 lg:w-32 m-3" />
          <p className="text-white">or</p>
          <hr className="border-t border-white w-12 lg:w-32 m-3" />
        </div>

        <div>
          <p className=" text-[14px] text-white inline">
            Dont have an account?
          </p>
          <p
            className=" text-[14px] text-white inline font-bold ml-1 cursor-pointer"
            onClick={openSignUp}
          >
            Register
          </p>
        </div>
      </div>
      <Footer/>
    </>
  );
}
