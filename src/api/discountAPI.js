import axiosClient from "./axiosClient";

const discountApi = {
  getAll: () => {
    const url = '/discount/all';
    return axiosClient.get(url);
  },

  get: (id, token) => {
    const url = `/discount/${id}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },
}

export default discountApi;