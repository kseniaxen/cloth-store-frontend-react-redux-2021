import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import Navigation from "./common/Navigation";
import {Switch, Route, Router} from 'react-router-dom'
import {Container, Spinner} from "react-bootstrap";

import {setLoading,setError,clearError} from '../stores/CommonStore'
import {setIsLoginFlag, setUser, reset} from '../stores/UserStore'
import {setAdminRoutes, setAnonymousRoutes, setLoggedRoutes} from "../stores/RouterStore";
import {adminRoutes, loggedRoutes, anonymousRoutes} from "../stores/RouterStore";
import UserModel from "../models/UserModel";

import history from '../history'

export default function App() {
    const routerStore = useSelector(state => state.RouterStore)
    const commonStore = useSelector(state => state.CommonStore)
    const userStore = useSelector(state => state.UserStore)
    const user = useSelector((state) => state.UserStore.user)
    const dispatch = useDispatch()

    const checkUserAuth = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/auth/users/check`, {
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response) {
                if (response.status === 'success') {
                    if (response.data) {
                        dispatch(setUser(new UserModel(response.data.name, response.data.roleName)))
                    }else{
                        dispatch(setIsLoginFlag(false))
                    }
                } else if (response.status === 'fail') {
                    dispatch(setIsLoginFlag(false))
                    dispatch(setError(response.message))
                }
                dispatch(setLoading(false))
            }
        }).catch((error) => {
            dispatch(setIsLoginFlag(false))
            dispatch(setLoading(false))
            dispatch(setError(error.message))
            throw error
        })
    }

    useEffect(() => {
        checkUserAuth()
    },[userStore.isLoginFlag])

    useEffect(() => {
        const changeRoutesOnUser = () => {
            if (user) {
               /* let signOutRoute
                if(userStore.user.roleName.includes("ADMIN")){
                    signOutRoute = adminRoutes.
                        find(route => route['path'].includes('/auth:out'))
                }else{
                    signOutRoute = loggedRoutes.
                        find(route => route['path'].includes('/auth:out'))
                }

                if (signOutRoute) {
                    signOutRoute['name'] = `Log Out (${userStore.user.name})`
                }

                */
                if (userStore.user.roleName.includes("ADMIN")) {
                    dispatch(setAdminRoutes())
                } else {
                    dispatch(setLoggedRoutes())
                }
                history.replace('/')
            } else {
                dispatch(setAnonymousRoutes())
                history.replace('/signin')
            }
        }
        changeRoutesOnUser()
    },[userStore.user])

    useEffect(() => {
        history.listen((location) => {
            if(location.pathname.includes("/auth:out")){
                dispatch(setLoading(true))
                fetch(`${commonStore.authBasename}/logout`, {
                    credentials: 'include'
                }).then((response) => {
                    return response.json()
                }).then((response) => {
                    if (response) {
                        if (response.status === 'success') {
                            // если выход произошел успешно - знуляем наблюдаемое свойство user
                            dispatch(setUser(null))
                            dispatch(setIsLoginFlag(false))
                        } else if (response.status === 'fail') {
                            dispatch(setError(response.message))
                        }
                        dispatch(setLoading(false))
                    }
                }).catch((error) => {
                    dispatch(setLoading(false))
                    dispatch(setError(error.message))
                    throw error
                })
                //dispatch(setIsLoginFlag(false))
            }
        })
    },[history])

    return <Router history={history}>
            <Navigation/>
            <Switch>
                {routerStore.routes.map(({ path, Component })=>{
                    return <Route key={path} path={path} exact>
                        <Container>
                            {commonStore.loading ? <Spinner animation="border" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}/> : <Component/>}
                        </Container>
                    </Route>
                })}
            </Switch>
        </Router>
}
