import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        quantityValue: 0
    },
    reducers: {
        setQuantity: (state, action) => {
            state.quantityValue = action.payload
        }
    }
})

export const { setQuantity } = cartSlice.actions
export default cartSlice.reducer

