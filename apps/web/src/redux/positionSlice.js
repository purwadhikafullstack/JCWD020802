import { createSlice } from "@reduxjs/toolkit";

export const positionSlice = createSlice({
    name: "position",
    initialState: {
        value: [-6.905977, 107.613144],
        provinceValue: {},
        cityValue: {},
        addressValue: {}
    },
    reducers: {
        setPosition: (state, action) => {
            state.value = action.payload
        },
        setSelectedProvince: (state, action) => {
            state.provinceValue = action.payload
        },
        setSelectedCity: (state, action) => {
            state.cityValue = action.payload
        },
        setSelectedAddress: (state, action) => {
            state.addressValue = action.payload
        }
    }
})

export const { setPosition, setSelectedProvince, setSelectedCity, setSelectedAddress } = positionSlice.actions
export default positionSlice.reducer

