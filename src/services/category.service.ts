import { api } from "@/lib/api";
import type { CategoryType } from "@/Type/category";

export async function fetchCategory(): Promise<CategoryType[]> {
  const res = await api.get("/categories");
  if (!res) throw new Error("Failed to fetch categories");
  return res.data.data;
}

export async function createCategory(payload: {
  name: string;
  is_active: boolean;
}) {
  const res = await api.post("/categories", payload);
  return res.data.data ?? res.data;
}
