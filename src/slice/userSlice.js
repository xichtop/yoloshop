import { createSlice } from '@reduxjs/toolkit';

const initialUser = {
  user: {
    Email: '',
    Password: '',
    Phone: '',
    Fullname: '',
    Address: '',
    URLPicture: '',
  },
  token: '',
};

const user = createSlice({
  name: 'user',
  initialState: initialUser,
  reducers: {
    login: (state, action) => {
      // const newProduct = action.payload;
        return {...action.payload}
    },

    logout: () => {
        // const newProduct = action.payload;
        return initialUser;
    },

    update: (state, action) => {
      // const newProduct = action.payload;
      return {...action.payload};
  },
  }
});

// export const { cartReducer } = cart;
const { reducer, actions } = user;
export const { login,  logout, update} = actions;
export default reducer;