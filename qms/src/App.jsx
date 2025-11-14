import Home from "./Component/pages/Home"
import img1 from './assets/images/img1.jpg';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
function App() {
  

  return (
    <>
    <Home/>
      <h1>hiiiii</h1>
      <img  src={img1} alt=" "/>
    </>
  )
}

export default App
