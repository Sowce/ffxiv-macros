import { BaseProvider, createDarkTheme } from "baseui";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import App from "./App";
import "./index.css";

const engine = new Styletron({});
const DarkTheme = createDarkTheme(
  {
    primaryFontFamily: "FFXIV, Noto Sans, Myriad Pro",
  },
  {
    colors: {
      buttonPrimaryFill: "#323d75",
      buttonPrimaryText: "#ffffff",
      buttonPrimaryHover: "#8692cb",
    },
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BaseProvider>
    </StyletronProvider>
  </React.StrictMode>
);
