import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL

export const Axios = axios.create({
    baseURL:BASE_URL
})