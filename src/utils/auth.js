import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode (token);

    // Get the current time and compare it to the token's expiry time
    // Note: JWT exp is in seconds and Date.now() returns milliseconds
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      // Token has expired
      localStorage.removeItem('token');  // Clear expired token from storage
      return false;
    }

    // Token is valid and not expired
    return true;
  } catch (error) {
    // Token is invalid or there was an error decoding it
    console.error('Error decoding token:', error);
    return false;
  }
};
