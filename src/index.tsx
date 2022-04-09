import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createGlobalStyle } from "styled-components";

const GlobalStyled = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: system-ui, sans-serif;
    min-height: 100vh;
    margin: 0;
    overflow: hidden;
  }

  *,
  *:after,
  *:before {
    box-sizing: border-box;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyled />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
