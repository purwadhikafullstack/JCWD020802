import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL
const LOCAL_URL = import.meta.env.LOCAL_HOST

export const Axios = axios.create({
    baseURL:BASE_URL
})

export const URL = axios.create({
    baseURL:LOCAL_URL
})