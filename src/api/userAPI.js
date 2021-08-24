import axiosClient from "./axiosClient";

const productApi = {
  login: (user) => {
    const url = '/user/login';
    return axiosClient.post(url, user);
  },
  
  logout: () => {
    const url = `/user/logout`;
    return axiosClient.get(url);
  },

  register: (user) => {
    const url = `/user/register`;
    return axiosClient.post(url, user);
  },

  update: (user, token) => {
    const url = `/user/update`;
    return axiosClient.post(url, user, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  get: (id, token) => {
    const url = `/user/get/${id}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

}

export default productApi;