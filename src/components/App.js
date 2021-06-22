import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import Navigation from "./common/Navigation";
import {Switch, Route, BrowserRouter} from 'react-router-dom'
import {Container} from "react-bootstrap";

import {setLoading,setError,clearError} from '../stores/CommonStore'
import {setUser} from '../stores/UserStore'
import {setAdminRoutes, setAnonymousRoutes, setLoggedRoutes} from "../stores/RouterStore";
import UserModel from "../models/UserModel";

export default function App() {
    const routerStore = useSelector(state => state.RouterStore)
    const commonStore = useSelector(state => state.CommonStore)
    const userStore = useSelector(state => state.UserStore)
    const dispatch = useDispatch()

    const checkUserAuth = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/auth/users/check`, {
            credentials:'include'
        }).then((response)=>{
            return response.json()
        }).then((response)=>{
            if(response){
                if(response.status === 'success'){
                    if(response.data){
                        dispatch(setUser(new UserModel(response.data.name, response.data.roleName)))
                    }
                }else if(response.status === 'fail'){
                    dispatch(setError(response.message))
                }
            }
        })
        if(userStore.user){
            if(userStore.user.roleName.includes("ADMIN")){
                dispatch(setAdminRoutes())
            }else{
                dispatch(setLoggedRoutes())
            }
        }else{
            dispatch(setAnonymousRoutes())
        }
    }

    useEffect(() => {
        checkUserAuth()
    })

    return (
        <BrowserRouter>
            <Navigation/>
            <Switch>
                {routerStore.routes.map(({ path, Component })=>{
                    return <Route key={path} path={path} exact>
                        <Container>
                            <Component/>
                        </Container>
                    </Route>
                })}
            </Switch>
        </BrowserRouter>
    );
}
