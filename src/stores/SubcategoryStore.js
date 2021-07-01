import { createSlice } from '@reduxjs/toolkit'

const SubcategoryStore = createSlice({
    name:'SubcategoryStore',
    initialState:{
        HTTP_STATUS_OK:200,
        HTTP_STATUS_CREATED:201,
        subcategories:[],
    },
    reducers:{
        setSubcategories:(state, action) => {
            state.subcategories = action.payload
        }
    }
})

export const {setSubcategories} = SubcategoryStore.actions
export default SubcategoryStore.reducer