import axiosClient from "./axiosClient";

const paymentApi = {
  getAll: (token) => {
    const url = '/payment';
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },
}

export default paymentApi;