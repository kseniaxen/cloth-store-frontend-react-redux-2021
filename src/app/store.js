import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import RouterReducer from "../stores/RouterStore"
import CommonReducer from '../stores/CommonStore'
import UserReducer from "../stores/UserStore";

export default configureStore({
    reducer: {
        RouterStore:RouterReducer,
        CommonStore:CommonReducer,
        UserStore:UserReducer
    },middleware:getDefaultMiddleware ({
        serializableCheck:false
    })
    }
)