import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


export const post_transaction = async (data)=>{

    const res = await api.post("/transactions", data);

    return res.data ;
}

export const get_transactions =async () => {
  const res = await api.get("/transactions");
  return res.data;
}

export const get_transactions_by_envelope = async (id) => {
  const res = await api.get(`/transactions/${id}`);
  return res.data;

  
}