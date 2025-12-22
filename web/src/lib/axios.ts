import { env } from "@/env"
import axios from "axios"

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true//faz com que os cookies do front-end sao enviados para o back-end
})