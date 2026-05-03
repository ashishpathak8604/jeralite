// JWT Token Helper — Store and retrieve tokens from localStorage

export const saveToken = (token) => localStorage.setItem('jeralite_token', token);
export const getToken = () => localStorage.getItem('jeralite_token');
export const removeToken = () => localStorage.removeItem('jeralite_token');

export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;

  try {
    // Decode token payload (JWT format: header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    const expiresAt = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > expiresAt;
  } catch (error) {
    return true;
  }
};
