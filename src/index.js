/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { PangolinProvider } from "@pangolindex/components";
import { MaterialUIControllerProvider } from "context";
import getLibrary from "./utils/getLibrary";

// Material Dashboard 2 React Context Provider
import App from "./App";

function AppProvider() {
  const { library, account } = useWeb3React();

  return (
    <PangolinProvider library={library} chainId={19} account={account}>
      <App />
    </PangolinProvider>
  );
}

ReactDOM.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AppProvider />
      </Web3ReactProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
