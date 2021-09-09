import { createSlice } from '@reduxjs/toolkit';

const initialReview = {
  reviews: [],
  vote: 5,
};

const review = createSlice({
  name: 'review',
  initialState: initialReview,
  reducers: {
    add: (state, action) => {
      // const newProduct = action.payload;
        return {...action.payload}
    },
  }
});

// export const { cartReducer } = cart;
const { reducer, actions } = review;
export const { add} = actions;
export default reducer;