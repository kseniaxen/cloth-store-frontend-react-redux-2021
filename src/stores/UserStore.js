import { createSlice } from '@reduxjs/toolkit'

const UserStore = createSlice({
    name:'UserStore',
    initialState:{
        user:null,
        userName:'',
        password:''
    },
    reducers:{
        setUser:(state, action) => {
            state.user = action.payload
        },
        setUserName:(state, action) => {
            state.userName = action.payload
        },
        setPassword:(state, action) => {
            state.password = action.payload
        },
        reset:(state) => {
            state.userName = ''
            state.password = ''
        }
    }
})

export const { setUser, setUserName,setPassword, reset } = UserStore.actions
export default UserStore.reducer;