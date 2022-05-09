import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
// import Home from "./pages/home"; // disabled for locker. Enable when homepage is ready
import NotFound404 from "./pages/notFound404";
import Dashboard from "./pages/Dashboard/dashboard";
import "./App.css";
import initWeb3 from "./utils/initWeb3";
import ConnectionContext from "./context/ConnectionContext";
import getProvider from "./utils/getProvider";
import BlockchainContext from "./context/BlockchainContext";

function ArbiCrypt() {
  const [provider, setProvider] = useState(undefined);
  const [web3Arb, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [networkId, setNetworkId] = useState(undefined);
  const [chainId, setChainId] = useState(undefined);

  const web3Modal = getProvider();

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onConnect();
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const onConnect = async () => {
    const _provider = await web3Modal.connect();

    const _web3 = initWeb3(_provider);

    const _accounts = await _web3.eth.getAccounts();

    const _address = _accounts[0];

    const _networkId = await _web3.eth.net.getId();

    const _chainId = await _web3.eth.getChainId();

    setProvider(_provider);
    setWeb3(_web3);
    setAddress(_address);
    setAccounts(_accounts);
    setNetworkId(_networkId);
    setChainId(_chainId);

    await subscribeProvider(_provider, _web3);
  };

  const subscribeProvider = async (_provider, _web3) => {
    if (!_provider.on) {
      return;
    }
    _provider.on("disconnect", () => resetApp());
    _provider.on("accountsChanged", async (_accounts) => {
      setAddress(_accounts[0]);
    });
    _provider.on("chainChanged", async (_chainId) => {
      const _networkId = await _web3.eth.net.getId();
      setChainId(_chainId);
      setNetworkId(_networkId);
    });
  };

  const resetApp = async () => {
    if (web3Arb && web3Arb.currentProvider && web3Arb.currentProvider.close) {
      await web3Arb.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    resetState();
  };

  const resetState = () => {
    setProvider(undefined);
    setWeb3(undefined);
    setAccounts(undefined);
    setAddress(undefined);
    setNetworkId(undefined);
    setChainId(undefined);
  };

  return (
    <ConnectionContext.Provider value={{ onConnect }}>
      <BlockchainContext.Provider
        value={{
          web3Arb,
          accounts,
          address,
          provider,
          networkId,
          chainId,
        }}
      >
        <Router>
          <Switch>
            <Redirect exact from="/" to="/app" />
            <Redirect from="/terms" to="/app/terms" />
            <Redirect from="/privacy" to="/app/privacy" />
            <Route path="/app" component={Dashboard} />
            {/* <Route exact path="/" component={Home} /> */}
            <Route component={NotFound404} />
          </Switch>
        </Router>
      </BlockchainContext.Provider>
    </ConnectionContext.Provider>
  );
}

export default ArbiCrypt;
