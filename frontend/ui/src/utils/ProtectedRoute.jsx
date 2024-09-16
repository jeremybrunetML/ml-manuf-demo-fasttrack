import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log(userInfo);
  if (!userInfo || (userInfo && !userInfo.authenticated)) {
    // user is not authenticated

    dispatch(() =>logout());

    return <Navigate to="/login" />;
  }
  return children;
};
