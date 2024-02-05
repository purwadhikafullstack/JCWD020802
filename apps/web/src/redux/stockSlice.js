import { createSlice } from "@reduxjs/toolkit";

export const stockSlice = createSlice({
    name: "stock",
    initialState: {
        warehouseValue: {},
        productValue: {}
    },
    reducers: {
        setSelectedWarehouse: (state, action) => {
            state.warehouseValue = action.payload
        },
        setSelectedProduct: (state, action) => {
            state.productValue = action.payload
        }
    }
})

export const { setSelectedWarehouse, setSelectedProduct } = stockSlice.actions
export default stockSlice.reducer

