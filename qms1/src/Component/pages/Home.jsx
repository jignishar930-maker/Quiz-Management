import React from "react";
<<<<<<< HEAD
import img from '.../assets/images/img1.jpg'
=======
import img1 from '../../assets/image/img1.jpg';
import { Link } from "react-router-dom";
function Home(){
    
    return(
        <>
        <div className="header">
           
             <h1>hiiiiiiii</h1>
        </div>
        
        </>
    )
>>>>>>> 1767ea8f2736d71ae19eb9e040d5e9e339124d80

function Home() {
  return (
    <>
      <div className="header">
        <img src={img} alt=""/>
        <h1>hiiiiiiii</h1>
      </div>
    </>
  );
}

export default Home;
