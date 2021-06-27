import { createSlice } from '@reduxjs/toolkit'

const UserStore = createSlice({
    name:'UserStore',
    initialState:{
        HTTP_STATUS_OK: 200,
        user:null,
        userName:'',
        password:'',
        isLoginFlag:true
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
        },
        setIsLoginFlag:(state, action) => {
            state.isLoginFlag = action.payload
        }
    }
})

export const { setUser, setUserName,setPassword, reset, setIsLoginFlag } = UserStore.actions
export default UserStore.reducer;