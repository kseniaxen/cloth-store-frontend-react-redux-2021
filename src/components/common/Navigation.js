import React from "react";
import {useDispatch, useSelector} from 'react-redux'
import {Container, Nav, Navbar} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {setCartShow} from "../../stores/CartStore"
import {Typography} from "@material-ui/core";

export default function Navigation(){
    const userStore = useSelector(state => state.UserStore)
    const routerStore = useSelector(state => state.RouterStore)
    const cartStore = useSelector(state => state.CartStore)
    const dispatch = useDispatch()

    const handleCartIconClick = () => {
        if (cartStore.cartShow) {
            dispatch(setCartShow(false))
        } else {
            dispatch(setCartShow(true))
        }
    }

    return(
        <Navbar bg="dark" variant="dark" sticky="top">
            <Container>
                <Navbar.Brand>Cloth Store</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    {routerStore.routes.map(route => {
                        if(!/^Dashboard[A-z]+$/.test(route.name)) {
                            return <NavLink
                                style={{marginLeft: '20px', color:"white"}}
                                key={route.path}
                                to={route.path}>
                                {route.name}
                            </NavLink>
                        }
                        })}
                    </Nav>
                    <div style={{display: userStore.user ? 'inline': 'none', marginLeft: '20px', color:"white"}}>
                        <Typography variant="h7" component="h7">
                            {userStore.userName}
                        </Typography>
                    </div>
                    <div style={{ display: userStore.user ? 'inline' : 'none', marginLeft: '20px', color:"white"}}>
                        <ShoppingCartIcon
                            style={{cursor: 'pointer'}}
                            onClick={handleCartIconClick}/>
                        {cartStore.cartItemsCount} ({cartStore.cartItemsTotalPrice})
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}