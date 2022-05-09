import React, { useCallback, useContext, useEffect, useState } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import PrivacyPolicy from "../privacyPolicy";
import TermsOfService from "../tos";
import LaunchPad from "./launchpad/launchpad";
import LiqLocker from "./liqLocker/liqLocker";
import style from "./dashboard.module.css";
import SideBar from "../../components/SideBar";
import Footer from "../../components/Footer";
import LockDetails from "./liqLocker/lockDetails";
import ConnectWallet from "../../components/ConnectWallet";
import ContractsContext from "../../context/ContractsContext";
import BlockchainContext from "../../context/BlockchainContext";

import ArbiCryptLocker from "../../contracts/ArbiCryptLocker.json";
import getProvider from "../../utils/getProvider";
import ConnectionContext from "../../context/ConnectionContext";
import { lockerAddress } from "../../utils/lockerUtils";

// const tokenAddress = "0x841F0BADdeEDdE4424e3fdA619FEc7A05928cd39";

function Dashboard() {
  let { path } = useRouteMatch();
  const web3Modal = getProvider();

  let [lockerContract, setLockerContract] = useState(undefined);
  let [lockerCAddress, setLockerCAddress] = useState(undefined);

  const blockchainContext = useContext(BlockchainContext);
  const connectionContext = useContext(ConnectionContext);
  const { web3Arb, address, networkId } = blockchainContext;
  const { onConnect } = connectionContext;

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onConnect();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initContracts = useCallback(async () => {
    if (web3Arb && networkId) {
      try {
        // const lockerDeployedNetwork = ArbiCryptLocker.networks[networkId];

        // const lockerInstance = new web3Arb.eth.Contract(
        //   ArbiCryptLocker.abi,
        //   lockerDeployedNetwork && lockerDeployedNetwork.address
        // );
        const lockerInstance = new web3Arb.eth.Contract(
          ArbiCryptLocker.abi,
          process.env.REACT_APP_LOCKER_CONTRACT
        );

        const lockerCAddress = await lockerAddress(lockerInstance, address);

        setLockerContract(lockerInstance);
        setLockerCAddress(lockerCAddress);
      } catch (error) {
        if (error.code === 4001) {
          console.log("user denied transaction");
          return;
        }
        if (
          error
            .toString()
            .includes("This contract object doesn't have address set yet")
        ) {
          console.error(error);
          return;
        }
        // alert("Error: can't load web3 connection. Please check console.");
        console.error(error);
      }
    }
  }, [web3Arb, networkId, address]);

  useEffect(() => {
    initContracts();
  }, [initContracts]);

  return (
    <>
      <ContractsContext.Provider
        value={{ lockerContract, lockerAddress: lockerCAddress }}
      >
        <div className={style.container}>
          <div className={style.sidebar}>
            <SideBar />
          </div>
          <div className="w-full relative">
            <div className={`${style.main}`}>
              <div className={style.header}>
                <ConnectWallet />
              </div>
              <Switch>
                <Route exact path={`${path}`} component={LiqLocker} />
                <Route
                  path={`${path}/locker/:address/:id`}
                  component={LockDetails}
                />
                <Route path={`${path}/launchpad`} component={LaunchPad} />
                <Route path={`${path}/terms`} component={TermsOfService} />
                <Route path={`${path}/privacy`} component={PrivacyPolicy} />
              </Switch>
            </div>

            <div className={style.footer}>
              <Footer />
            </div>
          </div>
        </div>
      </ContractsContext.Provider>
    </>
  );
}

export default Dashboard;
