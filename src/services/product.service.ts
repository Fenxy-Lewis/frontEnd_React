import { ENV } from "@/app/config/env";

export const fetchProducts = async (search: string) => {
  const params = new URLSearchParams();
  if (search.trim()) params.append("search", search.trim());

  const url = `${ENV.API_URL}/products?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};