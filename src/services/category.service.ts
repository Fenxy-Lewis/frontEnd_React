// fetch function
import { ENV } from "@/app/config/env";
export const fetchCategory = async () => {
  const res = await fetch(`${ENV.API_URL}/categories`); 
console.log(ENV.APP_NAME)
console.log(ENV.API_NAME)
console.log(ENV.API_URL)
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};