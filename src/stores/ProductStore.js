import { createSlice } from '@reduxjs/toolkit'
import history from "../history";

const ProductStore = createSlice({
    name:'ProductStore',
    initialState:{
        HTTP_STATUS_OK: 200,
        HTTP_STATUS_CREATED: 201,
        HTTP_STATUS_NO_CONTENT: 204,
        products:[],
        orderBy:'id',
        sortingDirection:'DESC',
        priceTo:null,
        priceFrom:null,
        quantityTo:null,
        quantityFrom:null,
        categoriesFilter:[],
        subcategoryFilter:[],
        sizeFilter:[]
    },
    reducers:{
        setProducts:(state, action) => {
            state.products = action.payload
        },
        setCategoriesFilter:(state, action) => {
            state.categoriesFilter = action.payload
        },
        setSubcategoryFilter:(state, action) => {
            state.subcategoryFilter = action.payload
        },
        setSizeFilter:(state, action) => {
            state.sizeFilter = action.payload
        },
        setOrderBy:(state, action) => {
            state.orderBy = action.payload
        },
        setSortingDirection:(state, action) => {
            state.sortingDirection = action.payload
        },
        setPriceTo:(state, action) => {
            state.priceTo = action.payload
        },
        setPriceFrom:(state, action) => {
            state.priceFrom = action.payload
        },
        setQuantityTo:(state, action) => {
            state.quantityTo = action.payload
        },
        setQuantityFrom:(state, action) => {
            state.quantityFrom = action.payload
        },
        historyPush:(state, action) => {
            history.push({
                pathname: '/shopping',
                search: `?orderBy=${state.orderBy}
                        &sortingDirection=${state.sortingDirection}
                        &search=
                            price>:${state.priceFrom};
                            price<:${state.priceTo};
                            quantity>:${state.quantityFrom};
                            quantity<:${state.quantityTo}
                            ${(action.payload && action.payload.length > 0) ? ';name:' + action.payload : ''}
                            ${(state.categoriesFilter && state.categoriesFilter.length > 0) ? ';category:' + JSON.stringify(state.categoriesFilter) : ''}
                            ${(state.subcategoryFilter && state.subcategoryFilter.length > 0) ? ';subcategory:' + JSON.stringify(state.subcategoryFilter) : ''}
                            ${(state.sizeFilter && state.sizeFilter.length > 0) ? ';size:' + JSON.stringify(state.sizeFilter) : ''}`
                    .replace(/\s/g, '')
            })
        }
    }
})

export const {setProducts,
    setCategoriesFilter,
    historyPush,
    setSubcategoryFilter,
    setSizeFilter,
    setOrderBy,
    setSortingDirection,
    setPriceTo,
    setPriceFrom,
    setQuantityTo,
    setQuantityFrom} = ProductStore.actions
export default ProductStore.reducer