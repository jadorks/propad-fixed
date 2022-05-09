import { Link } from "react-router-dom";

import React from "react";
function Home() {
  return (
    <>
      <p>HOME</p>
      <Link to="/">Home</Link>
      <Link to="/app">Launch App</Link>
    </>
  );
}

export default Home;
