import { api } from "@/lib/api";
export type Category = {
  id: number;
  name: string;
};
export async function fetchCategory(): Promise<Category[]> {
  const res = await api.get("/categories");
  if (!res) throw new Error("Failed to fetch categories");
  return res.data.data;
}

export async function createCategory(payload: { name: string; is_active: boolean }) {
  const res = await api.post("/categories", payload);
  return res.data.data ?? res.data;
}