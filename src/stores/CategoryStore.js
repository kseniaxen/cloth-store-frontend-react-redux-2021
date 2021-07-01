import { createSlice } from '@reduxjs/toolkit'

const CategoryStore = createSlice({
    name:'CategoryStore',
    initialState:{
        HTTP_STATUS_OK:200,
        HTTP_STATUS_CREATED:201,
        categories:[],
    },
    reducers:{
        setCategories:(state, action) => {
            state.categories = action.payload
        }
    }
})

export const {setCategories} = CategoryStore.actions
export default CategoryStore.reducer