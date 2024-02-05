import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        value: {},
        dayValue: {},
        monthValue: {},
        yearValue: {},
        genderValue: ""
    },
    reducers: {
        setData: (state, action) => {
            state.value = action.payload
        },
        setSelectedDay: (state, action) => {
            state.dayValue = action.payload
        },
        setSelectedMonth: (state, action) => {
            state.monthValue = action.payload
        },
        setSelectedYear: (state, action) => {
            state.yearValue = action.payload
        },
        setSelectedGender: (state, action) => {
            state.genderValue = action.payload
        }
    }
})

export const { setData, setSelectedDay, setSelectedMonth, setSelectedYear, setSelectedGender } = userSlice.actions
export default userSlice.reducer

