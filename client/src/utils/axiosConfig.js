import axios from 'axios';

//const baseURL = 'http://localhost:5000';
const baseURL =
 // process.env.NODE_ENV === 'development'
    process.env.NODE_ENV === 'production'
    ? 'http://localhost:5000'  // local server khi dev
    : 'https://nhahangcomnha-production.up.railway.app';  // URL Railway backend bạn
    
    // Khi gọi API
fetch(`${baseURL}/products/public`)
  .then(response => response.json())
  .then(data => console.log(data));

const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;