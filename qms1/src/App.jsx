import Home from "./Component/pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>

      <Home />
      <h1>hiiiii</h1>
    </>
  );
}

export default App;
