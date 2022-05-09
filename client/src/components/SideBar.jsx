import React, { useEffect, useState } from "react";
import NavItem from "./NavItem";
import { Link } from "react-router-dom";
import CoinGecko from "coingecko-api";
import home from "../assets/images/home.svg";
import lock from "../assets/images/lock.svg";
import launchpad from "../assets/images/launchpad.svg";
import eth from "../assets/images/Eth.svg";
import LogoWithText from "./LogoWithText";
import { usdFormatter } from "../utils/utils";

//Determine the width of this component from
//the calling component as it grows to fill the
// parent element
function SideBar(props) {
  const CoinGeckoClient = new CoinGecko();
  const [ethPrice, setEthPrice] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await CoinGeckoClient.simple.price({
        ids: ["ethereum"],
        vs_currencies: ["usd"],
      });
      setEthPrice(data.ethereum.usd);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="side-bar">
      <div className="side-bar__top-content">
        <div className="tagline">
          <Link to="/">
            <LogoWithText height={40} />
          </Link>
        </div>
        <div className="links-container">
          <NavItem disabled={true} image={home} text="Home" url="/" />
          <NavItem image={lock} text="Locker" url="/app" />
          <NavItem
            disabled={true}
            image={launchpad}
            text="Launchpad"
            url="/app/launchpad"
          />
        </div>
      </div>
      <div className="">
        <div className="ethereum">
          <NavItem image={eth} text="ETH" />
          <p className="eth__tagline">{usdFormatter.format(ethPrice)}</p>
        </div>
        <div className="line"></div>
        <div className="version">Version V1.10</div>
      </div>
    </div>
  );
}

export default SideBar;
