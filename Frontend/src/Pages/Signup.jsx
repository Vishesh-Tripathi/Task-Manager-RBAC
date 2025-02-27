import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import uranus from "../assets/uranus.gif"; // Replace with your logo path
import side from "../assets/side.gif"; // Replace with your GIF path
import axios from "axios";
import Robot from "../Components/Robot";

const Signup = () => {
  const [name,setName]= useState("");
  const [email,setEmail]= useState("");
  const [password,setPassword]= useState("");
  const url = import.meta.env.VITE_SERVER_DOMAIN;

  
  const handleSignup = async(e)=>{
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/auth//adminsignup`,{
        fullname:name,
        email,
        password
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }


  }
  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Left Section (Hidden on smaller screens) */}
      <div className="hidden md:flex w-full bg-gray-100 items-center justify-center">
        {/* <img
          src={side}
          alt="Animated Bars"
          className="w-[700px]"
        /> */}
        <Robot/>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-[#E3E3E3] flex items-center justify-center ">
        <div className="w-5/6 sm:w-2/3">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 flex items-center justify-center">
              {/* <img src={uranus} alt="Logo" /> */}
            </div>
          </div>

          {/* Welcome Text */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create your account
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            Please enter your details to sign up.
          </p>

          {/* Form */}
          <form>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="text-sm text-gray-600 block mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                onChange={(e)=>setName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="text-sm text-gray-600 block mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="text-sm text-gray-600 block mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <span className="absolute right-4 top-10 text-gray-400 cursor-pointer">
                👁️
              </span>
            </div>

            {/* <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input type="checkbox" id="terms" className="mr-2" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div> */}

            <button  onClick={handleSignup} className="w-full bg-black text-white py-3 rounded-lg mb-4 hover:bg-gray-800">
              Sign Up
            </button>

            {/* <button
              type="button"
              className="w-full flex items-center justify-center bg-gray-100 py-3 rounded-lg border hover:bg-gray-200"
            >
              <FcGoogle className="mr-2 text-xl" />
              Sign up with Google
            </button> */}
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <a href="/" className="text-blue-500 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
