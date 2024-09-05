import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const userLogin = createAsyncThunk("auth/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    // configure header's Content-Type as JSON
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(`/api/auth/login`, { username, password }, config);

    const { profileData } = await axios.get(`/api/auth/profile`, config);

    // store user's token in local storage
    localStorage.setItem("userProfile", profileData);
    localStorage.setItem("userToken", data.userToken);
    data.userProfile = profileData;

    return data;
  } catch (error) {
    // return custom error message from API if any
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});
