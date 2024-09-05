import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const userLogout = createAsyncThunk("auth/logout", async ( user, { rejectWithValue }) => {
  try {
    // configure header's Content-Type as JSON
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    await axios.post(`/api/auth/logout`, null, config);
  } catch (error) {
    // return custom error message from API if any
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});
