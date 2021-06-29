import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {reset, setUserName, setPassword, setIsLoginFlag} from "../../stores/UserStore"
import {setLoading,setError,clearError} from '../../stores/CommonStore'
import {Button, Card, Col, Form, Modal, Row} from "react-bootstrap";

export default function SignUp(){
    const userStore = useSelector(state => state.UserStore)
    const commonStore = useSelector(state => state.CommonStore)
    const dispatch = useDispatch()
    const [loginUser, setLoginUser] = useState('')
    const [passwordUser, setPasswordUser] = useState('')
    const [showModal, setShowModal] = useState(false)

    const handleUserNameChange = (e) => {
        setLoginUser(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPasswordUser(e.target.value)
    }

    const handleSubmitFrom = (e) => {
        e.preventDefault()

        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/auth/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': loginUser, 'password': passwordUser})
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.status === 'success') {
                fetch(`${commonStore.authBasename}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    credentials: 'include',
                    body: `username=${loginUser}&password=${passwordUser}`
                }).then((response) => {
                    return response.status
                }).then((statusCode) => {
                    if (statusCode === userStore.HTTP_STATUS_OK) {
                        dispatch(setUserName(loginUser))
                        dispatch(setPassword(passwordUser))
                        dispatch(setIsLoginFlag(true))
                    }
                }).catch((error) => {
                    dispatch(setError(error.message))
                    throw error
                })
            }else {
                setShowModal(true)
                dispatch(setError(response.message))
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    useEffect(() => {
        dispatch(reset())
    }, [])

    return(
        <Row className="justify-content-md-center mt-5">
            <Col xs={12} md={8}>
                <Modal show={showModal} onHide={()=>setShowModal(false)}>
                    <Modal.Body>{commonStore.error}</Modal.Body>
                </Modal>
                <Card
                    bg='light'>
                    <Card.Body>
                        <Card.Title>Registration</Card.Title>
                        <Form>
                            <Form.Group>
                                <Form.Label>Login</Form.Label>
                                <Form.Control id="username"
                                              value={loginUser}
                                              onChange={handleUserNameChange}
                                              type="text"
                                              placeholder="Enter login" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password"
                                              id="password"
                                              value={passwordUser}
                                              onChange={handlePasswordChange}
                                              placeholder="Enter password" />
                            </Form.Group>
                            <Button variant="primary"
                                    id='signInButton'
                                    disabled={commonStore.loading}
                                    onClick = {handleSubmitFrom}
                                    type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}