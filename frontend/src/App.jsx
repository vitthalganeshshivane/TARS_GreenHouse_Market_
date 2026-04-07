import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/signup.jsx'
import Login from './pages/login.jsx'
import ForgotPassword from './pages/forgot.jsx'
import VerifyOTP from './pages/verify.jsx'
import Success from './pages/success.jsx'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/signup' replace />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/verify' element={<VerifyOTP />} />
      <Route path='/success' element={<Success />} />
      <Route path='*' element={<Navigate to='/signup' replace />} />
    </Routes>
  )
}

export default App


