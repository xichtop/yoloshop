import axios from 'axios';
import queryString from 'query-string';
import { useSelector } from 'react-redux';

const axiosClient = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: "http://192.168.1.8:3001",
  headers: {
    'content-type': 'application/json',
  },
  // paramsSerializer: params => queryString.stringify(params),
});


axiosClient.interceptors.request.use((config) => {
  //   const token = await getFirebaseToken();
  //   if (token) {
  //     config.headers.Authorization = `Bearer ${token}`;
  //   }

  return config;
});

axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data;
  }

  return response;
}, (error) => {
  // Handle errors
  throw error;
});  

export default axiosClient;