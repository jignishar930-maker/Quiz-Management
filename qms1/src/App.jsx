<<<<<<< HEAD
import Home from "./Component/pages/Home";
=======
import Home from "./Component/pages/Home"
import img1 from './assets/image/img1.jpg';
import { BrowserRouter as Router, Routes,Route} from "react-router-dom";
import { useState } from "react";

function App() {
  
 const [count,setCount] = useState(0)
>>>>>>> 1767ea8f2736d71ae19eb9e040d5e9e339124d80

function App() {
  return (
    <>
<<<<<<< HEAD
      <Home />
=======
    <Router>
      <header/>
      <Routes>
        <Route path="/" element={<Home/>}>
        </Route>
        
      </Routes>
    </Router>
    <Home/>
>>>>>>> 1767ea8f2736d71ae19eb9e040d5e9e339124d80
      <h1>hiiiii</h1>
    </>
  );
}

export default App;
