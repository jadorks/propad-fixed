import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import Logo from "./Logo";

import twitter from "../assets/images/twitter.svg";
import discord from "../assets/images/discord.svg";
import telegram from "../assets/images/telegram.svg";
function Footer(props) {
  return (
    <footer className="footer">
      <div className="logo-container">
        <Link to="/">
          <Logo size={120} />
        </Link>
      </div>
      <div className="footer__content">
        <Link to="/terms">
          <span>Terms of Service</span>
        </Link>
        <span>|</span>
        <Link to="/privacy">
          <span>Privacy Policy</span>
        </Link>
        <span>|</span>
        <a href="https://arbiscan.io/" rel="noreferrer" target="_blank">
          <span>Arbiscan</span>
        </a>
      </div>
      <div className="icons-container">
        <a href="https://t.me/" target="_blank" rel="noreferrer">
          <Icon image={telegram} />
        </a>
        <a href="https://discord.com/invite/" target="_blank" rel="noreferrer">
          <Icon image={discord} />
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noreferrer">
          <Icon image={twitter} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
