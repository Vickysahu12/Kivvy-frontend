import axios from 'axios';

const API = axios.create({
  baseURL: "http://192.168.68.220:8000", // Apne PC ka IPv4 address
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
