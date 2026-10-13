import { useState } from 'react'
import BookingForm from './components/BookingForm'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BookingForm/>
    </>
  )
}

export default App
