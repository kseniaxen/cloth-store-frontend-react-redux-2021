import { createSlice } from '@reduxjs/toolkit'

const CartStore = createSlice({
    name:'CartStore',
    initialState:{
        HTTP_STATUS_OK:200,
        HTTP_STATUS_CREATED:201,
        cartItems:[],
        cartShow:false,
        cartStatusResponse:'',
        cartItemsCount:0,
        cartItemsTotalPrice:0.00
    },
    reducers:{
        setCartItems:(state, action) => {
            state.cartItems = action.payload
        },
        setCartShow:(state, action) => {
            state.cartShow = action.payload
        },
        setCartStatusResponse:(state, action) => {
            state.cartStatusResponse = action.payload
        },
        setCartItemsCount:(state, action) => {
            state.cartItemsCount = action.payload
        },
        setCartItemsTotalPrice :(state, action) => {
            state.cartItemsTotalPrice = action.payload
        }
    }
})

export const {setCartItems, setCartShow, setCartStatusResponse, setCartItemsCount, setCartItemsTotalPrice} = CartStore.actions
export default CartStore.reducer