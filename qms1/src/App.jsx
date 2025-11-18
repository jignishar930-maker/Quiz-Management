import Home from "./Component/pages/Home"
import img1 from './assets/image/img1.jpg';
import { BrowserRouter as Router, Routes,Route} from "react-router-dom";
import { useState } from "react";

function App() {
  
 const [count,setCount] = useState(0)

  return (
    <>
    <Router>
      <header/>
      <Routes>
        <Route path="/" element={<Home/>}>
        </Route>
        
      </Routes>
    </Router>
    <Home/>
      <h1>hiiiii</h1>
      <img  src={img1} alt=" "/>
    </>
  )
}

export default App
