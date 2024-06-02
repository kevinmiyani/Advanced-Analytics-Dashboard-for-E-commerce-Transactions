import React, { useEffect, useState } from "react";
import AdminStack from "./admin";
import CustomerStack from "./customer";
import LoginScreen from "./auth/LoginScreen";
import LoadingPage from "../components/LoadingPage";
import { useSelector } from "react-redux";
import { auth } from "../config/call";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "../redux/actions/authActions";

const MainContainer = () => {
  const token = localStorage.getItem("access_token");
  const type = localStorage.getItem("access_type");
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.auth.user);
  const isDataLoaded = useSelector((state) => state.auth.isDataLoaded);
  useEffect(() => {
    handleAuthCheck();
  }, []);

  const handleAuthCheck = async () => {
    if (token) {
      try {
        dispatch(setLoading(true));
        const response = await auth.getuserbytoken();
        dispatch(setUser(response?.data));
        localStorage.setItem("access_type", response?.data?.role);
        localStorage.setItem("access_token", response?.data?.token);
      } catch (error) {
        console.error("Error fetching user:", error);
        dispatch(setUser(null));
      }
    }
  };

  const ContentView = () => {
    console.log("isDataLoaded", isDataLoaded);
    if (userDetails || token) {
      if (isDataLoaded) {
        if (type === "ADMIN") return <AdminStack />;
        if (type === "CUSTOMER") return <CustomerStack />;
      } else {
        return <LoadingPage />;
      }
    }
    return <LoginScreen />;
  };
  return <div> {ContentView()}</div>;
};

export default MainContainer;
