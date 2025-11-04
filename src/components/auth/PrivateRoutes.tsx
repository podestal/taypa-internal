import { Outlet, Navigate } from "react-router-dom"
import { jwtDecode } from 'jwt-decode'
import useAuthStore from "../../store/useAuthStore"

interface DecodedToken {
  user_id?: number
  exp?: number
}

const PrivateRoutes = () => {
  // Check if user is authenticated by checking localStorage for access token
  const access = useAuthStore((state) => state.access)
  const clearTokens = useAuthStore((state) => state.clearTokens)

  // If no access token, redirect to login
  if (!access) {
    return <Navigate to="/login" replace />
  }

  // Check if token is expired
  try {
    const decoded = jwtDecode<DecodedToken>(access)
    
    // Check if token has expiration and if it's expired
    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000) // Convert to Unix timestamp
      
      if (decoded.exp < currentTime) {
        // Token is expired, clear tokens and redirect to login
        clearTokens()
        return <Navigate to="/login" replace />
      }
    }
  } catch (error) {
    // If token is invalid or can't be decoded, clear tokens and redirect
    console.error('Error decoding token:', error)
    clearTokens()
    return <Navigate to="/login" replace />
  }
  
  // If authenticated and token is valid, render the protected routes
  return <Outlet />
}

export default PrivateRoutes