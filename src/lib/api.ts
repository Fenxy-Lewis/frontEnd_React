import axios from "axios";
import { ENV } from "@/app/config/env";
export const api = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiImage = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});