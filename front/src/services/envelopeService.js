import axios from "axios"
import { data } from "react-router-dom";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});




export const get_envelopes = async ()=>{

        const res = await api.get("/envelopes/");
       
        return res.data.envelopes;
  
}

export const get_envelope = async (id)=>{

        const res = await api.get(`/envelopes/${id}`);
       
        return res.data;
  
}

export const post_envelope = async (data)=>{

        const res = await api.post("/envelopes/",data);
       
        return res.data;
  
}

export const delete_envelope = async (id) => {

        const res = await api.delete(`/envelopes/${id}`);
        return res.data;
        
}

export const update_envelope = async (id,data) => {

        const res = await api.put(`/envelopes/${id}`, data)
        return res.data;
}

export default api;
