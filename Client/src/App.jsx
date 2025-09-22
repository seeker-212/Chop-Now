import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'

//Exporting Server URL so other pages can use it 
export const serverUrl = 'http://localhost:5000'

const App = () => {
  useGetCurrentUser()
  const {userData} = useSelector(state => state.user)
  return (
    <Routes>
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
    </Routes>
  )
}

export default App
