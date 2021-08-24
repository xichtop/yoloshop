import axiosClient from "./axiosClient";

const paymentApi = {
  getAll: (params) => {
    const url = '/payment';
    return axiosClient.get(url, { params });
  },
}

export default paymentApi;