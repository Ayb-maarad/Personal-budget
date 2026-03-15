import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

export default api;
