import axiosClient from "./axiosClient";

const shippingApi = {
  getAll: (params) => {
    const url = '/shipping';
    return axiosClient.get(url, { params });
  },
}

export default shippingApi;