import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


export const post_transaction = async (data)=>{

    const res = await api.post("/transactions", data);

    return res.data ;
}