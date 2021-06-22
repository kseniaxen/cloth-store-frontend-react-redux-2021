import { createSlice } from '@reduxjs/toolkit'

const CommonStore = createSlice({
    name:"CommonStore",
    initialState:{
        loading:false,
        error:'',
        basename:'http://localhost:8090/shop/api',
        authBasename:'http://localhost:8090/shop'
    },
    reducers:{
        setLoading:(state, action) => {
            state.loading = action.payload
        },
        setError:(state, action) => {
            state.error = action.payload
        },
        clearError:(state, action) => {
            state.error = ''
        }
    }
})

export const {setLoading, setError, clearError} = CommonStore.actions
export default CommonStore.reducer