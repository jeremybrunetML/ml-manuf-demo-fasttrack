import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { MarkLogicProvider } from "ml-fasttrack";
import { BrowserRouter as Router } from "react-router-dom";
import ThemeProvider from "./utils/ThemeContext";
import App from "./App";
import store from './app/store'
import axios from "axios";

axios.defaults.withCredentials = true

import requestInterceptor, { responseInterceptor } from "./interceptors/axios.interceptor";

const host = process.env.REACT_APP_HOST || "localhost";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <MarkLogicProvider
        scheme="http"
        host={host}
        port="8076"
        options="all"
        paginationOptions={{ pageLength: 10 }}
        requestInterceptor={requestInterceptor}
        responseInterceptor={responseInterceptor}
      >
        <Router>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </Router>
      </MarkLogicProvider>
    </Provider>
  </React.StrictMode>
);
