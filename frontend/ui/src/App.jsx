import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";
import Home from "./layouts/home.jsx";
import NotFound from "./layouts/notFound.jsx";
import { ProtectedRoute } from "./utils/ProtectedRoute.jsx";
import Admin from "./layouts/admin.jsx";
import Login from "./layouts/login.jsx";

import { useGetUserDetailsQuery } from './app/services/auth/authService'
import { setCredentials } from './features/auth/authSlice'

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  const dispatch = useDispatch()

  // automatically authenticate user if token is found
  const { data, isFetching } = useGetUserDetailsQuery('userDetails', {
    pollingInterval: 900000, // 15mins
  })

  useEffect(() => {
    if (data) dispatch(setCredentials(data))
  }, [data, dispatch])

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
