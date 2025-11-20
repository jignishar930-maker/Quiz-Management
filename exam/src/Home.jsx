import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Home() {
  const [count, setCount] = useState(10)

  return (
    <>
      {}
      <h1>counter decreament</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count - 1)}>
          count is {count}
        </button>
        {}
      </div>
      {}
    </>
  )
}

export default Home

