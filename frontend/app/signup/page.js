"use client";
import React, { useEffect, useState } from "react";
import PasswordChecklist from "react-password-checklist";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [error, setError] = useState("");

  const [emailValid, setEmailValid] = useState({
    entered: false,
    isValid: false,
  });
  const [password, setPassword] = useState();
  const [passwordValid, setPasswordValid] = useState({
    entered: false,
    isValid: false,
  });
  const [rePassword, setrePassword] = useState({
    entered: false,
    isCorrect: false,
  });
  const [pwdIcorrect, setpwdIcorrect] = useState({
    entered: false,
    isCorrect: false,
  });

  const [allValid, setAllValid] = useState(false);
  useEffect(() => {
    if (rePassword != password) {
      setpwdIcorrect({ entered: true, isCorrect: false });
    } else setpwdIcorrect({ entered: true, isCorrect: true });
  }, [rePassword]);
  useEffect(() => {
    setAllValid(
      emailValid.isValid && passwordValid.isValid && pwdIcorrect.isCorrect
    );
  });
  const checkEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z.-]+\.[A-Z]{2,}$/i;
    if (emailRegex.test(email)) {
      setEmail(email);
      setEmailValid({ entered: true, isValid: true });
    } else {
      setEmailValid({ entered: true, isValid: false });
    }
  };

  const openLogin = () => {
    router.push("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = { email, password, username };
    try {
      const response = await fetch("http://localhost:8080/api/users/signup", {
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
            const logintoken = data.token;
            localStorage.setItem("token", logintoken);
            router.push("/login")
          })
          .catch((error) => {
            console.error("Error parsing JSON response:", error);
          });
      } else {
        response
          .json()
          .then((data) => {
            const successMessage = data.message;
            // Access the "message" property
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
    <div>
      <div className="">
        <div className="flex flex-col items-center justify-center h-[100vh] gap-3 lg:gap-5 bg-[#2B3137] rounded mx-auto p-6 lg:p-8 ">
          <h1 className="inline text-white text-3xl lg:text-4xl mb-2 font-bold">
            Sign Up
          </h1>
          {error && (
            <div className="flex justify-center items-center h-10">
              <p className="font-bold text-red-500 ml-5">{error}</p>
            </div>
          )}

          <div>
            <p className="text-white text-lg">Email</p>
            <input
              type="email"
              className="rounded w-72 h-10 text-lg lg:w-[300px]  p-1 text-black"
              onChange={(e) => {
                checkEmail(e.target.value);
                setEmail(e.target.value);
              }}
            />
            {emailValid.entered && !emailValid.isValid && (
              <p className="text-red-500 text-[12px] mt-1">Email invalid</p>
            )}
          <p className="text-white text-lg mt-5">Username</p>
            <input
              type="text"
              className="rounded w-72 h-10 text-lg lg:w-[300px] text-black  p-1"
              onChange={(e) => {
                  setUsername(e.target.value);
                }}
                />
                </div>
          <div>
            <p className="text-white text-lg ">Password</p>
            <input
              type="password"
              className="rounded w-72 h-10 text-lg lg:w-[300px] text-black  p-1"
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordValid({ entered: true, isValid: false });
                setPassword(e.target.value);
              }}
            />
          </div>
          {passwordValid.entered && !passwordValid.isValid && (
            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital"]}
              minLength={8}
              value={password}
              className="text-white text-md  lg:text-sm"
              onChange={(isValid) => {
                setPasswordValid({
                  entered: passwordValid.entered,
                  isValid: isValid,
                });
              }}
              iconSize={18}
              validColor="#2DBA4E"
            />
          )}
          <div>
            <p className="text-white text-lg">Re-enter Password</p>
            <input
              type="password"
              className="rounded w-72 text-lg h-10 lg:w-[300px] text-black p-1"
              onChange={(e) => {
                setpwdIcorrect({
                  entered: pwdIcorrect.entered,
                  isCorrect: false,
                });
                setrePassword(e.target.value);
              }}
            />
            {pwdIcorrect.entered && !pwdIcorrect.isCorrect && (
              <p className="text-red-500 text-[14px] mt-1">
                Password does not match{" "}
              </p>
            )}
          </div>
       
            <button
              className={
                allValid
                  ? "bg-[#2DBA4E] text-lg  w-64 h-10 lg:w-40 px-[70px]  lg:px-12 py-1 rounded text-white"
                  : "bg-gray-400 text-lg w-64 h-10 lg:w-40 px-[70px]  lg:px-12 py-1 rounded text-white disabled:"
              }
              disabled={!allValid}
              onClick={handleSubmit}
            >
              Sign up
            </button>
          

          <div className="flex flex-row">
            <hr className="border-t border-white w-12 lg:w-32 m-3" />
            <p className="text-white">or</p>
            <hr className="border-t border-white w-12 lg:w-32 m-3" />
          </div>

          <div>
            <p className="text-[14px]  text-white inline">
              Already have an account?
            </p>
            <p
              className="text-[14px]  text-white inline font-bold ml-1 cursor-pointer"
              onClick={openLogin}
            >
              Login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
