
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Drive from './pages/Drive'
import Login from './pages/Login'

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route
          path="/login"
          element={<Login mode="login" />}
        />

        <Route
          path="/register"
          element={<Login mode="register" />}
        />

        <Route
          path="/"
          element={<Drive />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  )
}

export default App
