import { createSlice } from '@reduxjs/toolkit'

const SizeStore = createSlice({
    name:'SizeStore',
    initialState:{
        HTTP_STATUS_OK:200,
        HTTP_STATUS_CREATED:201,
        sizes:[],
    },
    reducers:{
        setSizes:(state, action) => {
            state.sizes = action.payload
        }
    }
})

export const {setSizes} = SizeStore.actions
export default SizeStore.reducer