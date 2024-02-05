import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: "product",
    initialState: {
        categoryValue: {}
    },
    reducers: {
        setSelectedCategory: (state, action) => {
            state.categoryValue = action.payload
        }
    }
})

export const { setSelectedCategory } = productSlice.actions
export default productSlice.reducer

