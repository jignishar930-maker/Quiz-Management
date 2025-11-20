import React from "react";
import img1 from "../../assets/image/img1.jpg";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="header">
        <h1>hiiiiiiii</h1>
        
        <img src={img1} alt="Example" /> 
      </div>
    </>
  );
}

export default Home;
