import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import Navigation from "./common/Navigation";
import {Switch, Route, Router} from 'react-router-dom'
import {Button, Container, Modal, Table} from "react-bootstrap";
import Alert from '@material-ui/lab/Alert';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';

import {setLoading,setError,clearError} from '../stores/CommonStore'
import {setIsLoginFlag, setUser} from '../stores/UserStore'
import {setAdminRoutes, setAnonymousRoutes, setLoggedRoutes} from "../stores/RouterStore";
import UserModel from "../models/UserModel";

import history from '../history'
import {CircularProgress, Snackbar} from "@material-ui/core";
import {
    setCartItems,
    setCartItemsCount,
    setCartItemsTotalPrice,
    setCartShow,
    setCartStatusResponse
} from "../stores/CartStore";

export default function App() {
    const routerStore = useSelector(state => state.RouterStore)
    const commonStore = useSelector(state => state.CommonStore)
    const userStore = useSelector(state => state.UserStore)
    const cartStore = useSelector(state => state.CartStore)
    const productStore = useSelector(state => state.ProductStore)
    const user = useSelector((state) => state.UserStore.user)
    const dispatch = useDispatch()

    const [snackBarVisibility, setSnackBarVisibility] = useState(false)
    const [snackBarText, setSnackBarText] = useState('')
    const [snackBarSeverity, setSnackBarSeverity] = useState('success')

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
                        fetchCartItems()
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

    const fetchCartItems = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/cart`, {
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    dispatch(setCartItems(
                        JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(responseModel.data)
                                .replace(/(%2E)/ig, '%20')
                        )
                    )))
                } else if (responseModel.status === 'fail') {
                    dispatch(setError(responseModel.message))
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    useEffect(() => {
        checkUserAuth()
    },[userStore.isLoginFlag])

    useEffect(() => {
        switch (cartStore.cartStatusResponse) {
            case "success":
                setSnackBarText('One product added to the cart')
                setSnackBarSeverity('success')
                setSnackBarVisibility(true)
                break
            case "warning":
                setSnackBarText('You have taken the maximum number of item')
                setSnackBarSeverity('warning')
                setSnackBarVisibility(true)
                break
            default:
                break
        }
        dispatch(setCartStatusResponse(''))
    },[cartStore.cartStatusResponse])

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
                //history.replace('/')
            } else {
                dispatch(setAnonymousRoutes())
                //history.replace('/signin')
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

    useEffect(() => {
        dispatch(setCartItemsCount(
            cartStore.cartItems
                .map(cartItem => cartItem.quantity)
                .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
        ))
        dispatch(setCartItemsTotalPrice(
            cartStore.cartItems
                .map(cartItem => cartItem.price * cartItem.quantity)
                .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
                .toFixed(2)
        ))
    }, [cartStore.cartItems])

    const handlePurchase = () => {

    }

    const handleSnackBarClose = (e, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarVisibility(false)
        setSnackBarSeverity('success')
    }

    const addToCart = (productId, notifySuccess) => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/cart/` + productId,{
            method: 'POST',
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    // запрос на получение всех элементов с сервера
                    fetchCartItems()
                    // уведомление пользователя об успехе
                    notifySuccess()
                } else if (responseModel.status === 'fail') {
                    dispatch(setError(responseModel.message))
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const subtractFromCart = (productId, notifySuccess) => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/cart/` + productId,{
            method: 'PATCH',
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    // запрос на получение всех элементов с сервера
                    fetchCartItems()
                    // уведомление пользователя об успехе
                    notifySuccess()
                } else if (responseModel.status === 'fail') {
                    commonStore.setError(responseModel.message)
                }
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        })
        dispatch(setLoading(false))
    }

    const handleCartItemPlus = (e, productId) => {
        if(cartStore.cartItems.find(product => product.productId === productId) === undefined ||
            (cartStore.cartItems.find(product => product.productId === productId).quantity <
                (productStore.products.find(product => product.id === productId).quantity)
            )
        ) {
            addToCart(productId, () => {
                setSnackBarText('One product added to the cart')
                setSnackBarSeverity('success')
                setSnackBarVisibility(true)
            })
        }else{
            dispatch(setCartStatusResponse('warning'))
        }
    }

    const handleCartItemNeg = (e, productId) => {
        subtractFromCart(productId, () => {
            setSnackBarText('One product was subtracted from the cart')
            setSnackBarSeverity('success')
            setSnackBarVisibility(true)
        })
    }


    return <Router history={history}>
            <Navigation/>
            <Switch>
                {routerStore.routes.map(({ path, Component })=>{
                    return <Route key={path} path={path} exact>
                        <Container>
                            {commonStore.loading ? <CircularProgress style={{ position: "fixed", top: "50%", left: "50%" }}/> : <Component/>}
                        </Container>
                    </Route>
                })}
            </Switch>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={cartStore.cartShow}>
                <Modal.Header>
                    <Modal.Title>
                        Shopping cart
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        cartStore.cartItemsCount > 0 ? (
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    cartStore.cartItems.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.name}</th>
                                                <td>{item.price}</td>
                                                <td>{item.quantity}</td>
                                                <td>{(item.price * item.quantity).toFixed(2)}</td>
                                                <td>
                                                    <Button
                                                        style={{marginLeft:'15px'}}
                                                        onClick={(e) => {
                                                            handleCartItemPlus(e, item.productId)
                                                        }}>
                                                        <ExposurePlus1Icon/>
                                                    </Button>
                                                    <Button
                                                        style={{marginLeft:'15px'}}
                                                        onClick={(e) => {
                                                            handleCartItemNeg(e, item.productId)
                                                        }}>
                                                        <ExposureNeg1Icon/>
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </Table>
                        ):
                            (
                                <div>Your cart is empty</div>
                            )
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handlePurchase}>Purchase</Button>
                    <Button onClick={() => {dispatch(setCartShow(false))
                    }}>Close</Button>
                </Modal.Footer>
            </Modal>
        <Snackbar
            open={snackBarVisibility}
            autoHideDuration={6000} onClose={handleSnackBarClose}>
            <Alert onClose={handleSnackBarClose} severity={snackBarSeverity}>
                {snackBarText}
            </Alert>
        </Snackbar>
        </Router>
}
