import axiosClient from "./axiosClient";

const shippingApi = {
  getAll: (token) => {
    const url = '/shipping';
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },
}

export default shippingApi;