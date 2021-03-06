import React, {useEffect, useState} from "react"
import {useSelector, useDispatch} from "react-redux"
import {reset, setUserName, setPassword, setIsLoginFlag} from "../../stores/UserStore"
import {setLoading,setError,clearError} from '../../stores/CommonStore'
import {Button, Card, Col, Form, Modal, Row} from "react-bootstrap";

export default function SignIn(){
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

    const handleSubmitForm = (e) => {
        e.preventDefault()

        if(loginUser === '' || passwordUser === ''){
            dispatch(setError("Input a valid login or password"))
            setShowModal(true)
        }else{
            dispatch(clearError())
            dispatch(setLoading(true))
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
                } else {
                    setShowModal(true)
                    dispatch(setError("Login or password is wrong"))
                }
            }).catch((error) => {
                dispatch(setError(error.message))
                throw error
            })
            dispatch(setLoading(false))
        }
    }

    useEffect(() => {
        dispatch(reset())
    },[])
    return(
        <Row className="justify-content-md-center mt-5">
            <Col xs={12} md={8}>
                <Modal show={showModal} onHide={()=>setShowModal(false)}>
                    <Modal.Body>{commonStore.error}</Modal.Body>
                </Modal>
                <Card
                    bg='light'>
                    <Card.Body>
                        <Card.Title>Log In</Card.Title>
                        <Form>
                            <Form.Group>
                                <Form.Label>Login</Form.Label>
                                <Form.Control id="username"
                                              value={loginUser}
                                              onChange={handleUserNameChange}
                                              type="text"
                                              placeholder="Enter login">
                                </Form.Control>
                                </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password"
                                              id="password"
                                              value={passwordUser}
                                              onChange={handlePasswordChange}
                                              placeholder="Enter password">
                                </Form.Control>
                            </Form.Group>
                            <Button variant="dark"
                                    id='signInButton'
                                    disabled={commonStore.loading}
                                    onClick = {handleSubmitForm}
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