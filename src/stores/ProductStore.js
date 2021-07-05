import { createSlice } from '@reduxjs/toolkit'

const ProductStore = createSlice({
    name:'ProductStore',
    initialState:{
        HTTP_STATUS_OK: 200,
        HTTP_STATUS_CREATED: 201,
        HTTP_STATUS_NO_CONTENT: 204,
        products:[]
    },
    reducers:{
        setProducts:(state, action) => {
            state.products = action.payload
        }
    }
})

export const {setProducts} = ProductStore.actions
export default ProductStore.reducer