/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";

import io from "socket.io-client";
const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("user", user);
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });
      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }

      console.log("current user Details", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // socket connectiom
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);
  // useEffect(() => {
  //   const backendURL = process.env.REACT_APP_BACKEND_URL;
  //   console.log("Backend URL:", backendURL);

  //   const token = localStorage.getItem("token");
  //   console.log("Retrieved Token:", token);

  //   const socketConnection = io(backendURL, {
  //     withCredentials: true,
  //     // transports: ["websocket"], // Force WebSocket
  //     auth: { token: localStorage.getItem("token") },
  //     reconnection: true,
  //     reconnectionAttempts: 5,
  //     reconnectionDelay: 2000,
  //   });

  //   socketConnection.on("connect_error", (err) => {
  //     console.error("Socket connection error:", err.message);
  //   });

  //   socketConnection.on("onlineUser", (data) => {
  //     console.log("Online Users:", data);
  //     dispatch(setOnlineUser(data));
  //   });

  //   dispatch(setSocketConnection(socketConnection));

  //   return () => {
  //     socketConnection.close(); // Properly clean up connection
  //   };
  // }, []);

  const basePath = location.pathname === "/";

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      {/* {message component} */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={` justify-center items-center flex-col gap-2 hidden${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div>{/* <img src={logo} width={250} alt='logo' /> */}</div>
        {/* <p className="text-lg mt-2 text-slate-500">Select user to message</p> */}
      </div>
    </div>
  );
};

export default Home;
