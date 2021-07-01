import React from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import {useSelector} from "react-redux";

import goodsImg from '../../../images/goods.jfif'
import {NavLink} from "react-router-dom";

export default function Dashboard(){
    const routerStore = useSelector(state => state.RouterStore)
    return(
        <Row xs={1} md={2} lg={4}>
            {
                routerStore.routes.map(route => {
                    if(/^Dashboard[A-z]+$/.test(route.name)){
                        return <Col>
                            <Card>
                                <Card.Img variant="top" src={goodsImg} />
                                <Card.Body>
                                    <Card.Title style={{fontSize:'16px'}}>{route.name}</Card.Title>
                                    <NavLink
                                        key={route.path}
                                        to={route.path}>
                                        <Button>Go</Button>
                                    </NavLink>
                                </Card.Body>
                            </Card>
                        </Col>
                    }
                })
            }
        </Row>
    )
}