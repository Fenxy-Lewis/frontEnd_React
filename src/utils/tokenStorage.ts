export const setAcessToken = (token: string) => {
  // Set
  localStorage.setItem("AcessToken", token);
};
// Get
export const getAcessToken = () => {
  return localStorage.getItem("AcessToken");
};
// Remove
export const removeAcessToken = () => {
  localStorage.removeItem("AcessToken");
};
