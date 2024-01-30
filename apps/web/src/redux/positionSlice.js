import { createSlice } from "@reduxjs/toolkit";

export const positionSlice = createSlice({
    name: "position",
    initialState: {
        value: [-6.905977, 107.613144]
    },
    reducers: {
        setPosition: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setPosition } = positionSlice.actions
export default positionSlice.reducer

