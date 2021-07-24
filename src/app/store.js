import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import RouterReducer from "../stores/RouterStore"
import CommonReducer from '../stores/CommonStore'
import UserReducer from "../stores/UserStore";
import CategoryReducer from "../stores/CategoryStore";
import SubcategoryReducer from "../stores/SubcategoryStore";
import SizeReducer from "../stores/SizeStore";
import ProductReducer from "../stores/ProductStore";
import CartReducer from "../stores/CartStore";
import {CallReceivedTwoTone} from "@material-ui/icons";

export default configureStore({
    reducer: {
        RouterStore:RouterReducer,
        CommonStore:CommonReducer,
        UserStore:UserReducer,
        CategoryStore:CategoryReducer,
        SubcategoryStore:SubcategoryReducer,
        SizeStore:SizeReducer,
        ProductStore: ProductReducer,
        CartStore: CartReducer
    },middleware:getDefaultMiddleware ({
        serializableCheck:false
    })
    }
)