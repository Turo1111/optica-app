import axios from "axios";

const apiClient = axios.create({
  // URL para variable de entorno
  baseURL: "https://optica-api.onrender.com/"
});

export default apiClient;