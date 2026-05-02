// tokenHelper utility — Phase 3
// TODO: Helper functions for JWT storage in localStorage

export const saveToken  = (token) => localStorage.setItem('jeralite_token', token);
export const getToken   = ()      => localStorage.getItem('jeralite_token');
export const removeToken = ()     => localStorage.removeItem('jeralite_token');
