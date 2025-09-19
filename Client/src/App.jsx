import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

//Exporting Server URL so other pages can use it 
export const serverUrl = 'http://localhost:5000'

const App = () => {
  return (
    <Routes>
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
    </Routes>
  )
}

export default App
