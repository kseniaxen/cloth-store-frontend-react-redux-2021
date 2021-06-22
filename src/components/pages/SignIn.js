import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {reset, setUserName, setPassword} from "../../stores/UserStore";
import {Button, Card, Col, Form, Row} from "react-bootstrap";

export default function SignIn(){
    const dispatch = useDispatch()
    const userStore = useSelector(state => state.UserStore)

    const handleUserNameChange = (e) => {
        console.log(e.target.value)
        dispatch(setUserName(e.target.value))
        console.log(userStore.userName)
    }

    useEffect(() => {
        dispatch(reset())
    })
    return(
        <Row className="justify-content-md-center mt-5">
            <Col xs={12} md={8}>
                <Card
                    bg='light'>
                    <Card.Body>
                        <Card.Title>Log In</Card.Title>
                        <Form>
                            <Form.Group>
                                <Form.Label>Login</Form.Label>
                                <Form.Control id="username"
                                              value={userStore.userName}
                                              onChange={handleUserNameChange}
                                              type="text"
                                              placeholder="Enter login" />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}