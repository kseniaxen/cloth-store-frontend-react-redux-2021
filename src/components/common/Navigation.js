import React from "react";
import { useSelector} from 'react-redux'
import {Container, Nav, Navbar} from "react-bootstrap";
import {NavLink} from "react-router-dom";

export default function Navigation(){
    const routerStore = useSelector(state => state.RouterStore)
    return(
        <Navbar bg="light" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand>Cloth Store</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    {routerStore.routes.map(route => {
                        if(!/^Dashboard[A-z]+$/.test(route.name)) {
                            return <NavLink
                                style={{marginLeft: '20px'}}
                                key={route.path}
                                to={route.path}>
                                {route.name}
                            </NavLink>
                        }
                        })}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}