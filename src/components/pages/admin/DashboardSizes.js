import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearError, setError, setLoading} from "../../../stores/CommonStore";
import {setSizes} from "../../../stores/SizeStore";
import {Button, Form, Modal, Table} from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

export default function DashboardSizes(){
    const commonStore = useSelector(state => state.CommonStore)
    const sizeStore = useSelector(state => state.SizeStore)
    const dispatch = useDispatch()

    const [modalVisibility, setModalVisibility] = useState(false)
    const [titleSize, setTitleSize] = useState('')
    const [currentSizeId, setCurrentSizeId] = useState(null)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const handleSizeAdd = (e) => {
        setCurrentSizeId(null)
        setTitleSize('')
        setModalVisibility(true)
    }

    const handleSizeTitleChange = (e) => {
        setTitleSize(e.target.value)
    }

    const handleSizeEdit = (e, sizeId) => {
        setModalVisibility(true)
        setCurrentSizeId(sizeId)
        setTitleSize(sizeStore.sizes.find((c) => c.id === sizeId)?.title || '')
    }

    const handleSizeDelete = (e, sizeId) => {
        setCurrentSizeId(sizeId)
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/sizes/${sizeId}`,{
            method: 'DELETE'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    fetchSizes()
                    setCurrentSizeId(null)
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

    const handleSubmitForm = (e) => {
        e.preventDefault()
        if(titleSize.length > 0 && titleSize.trim() !== ''){
            if(sizeStore.sizes.find((c) => c.title === titleSize) !== undefined) {
                setShowError(true)
                setErrorMessage('This title is already takes')
            }else{
                if (!currentSizeId) {
                    addSize()
                } else {
                    updateSize()
                }
                setModalVisibility(false)
                setShowError(false)
            }
        }else{
            setShowError(true)
            setErrorMessage('Invalid title')
        }
    }

    const fetchSizes = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/sizes`,{
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    dispatch(setSizes(JSON.parse(
                        decodeURIComponent(
                            JSON.stringify(responseModel.data)
                                .replace(/(%2E)/ig, "%20")
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

    const addSize = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/sizes`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'title': encodeURIComponent(titleSize)})
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === sizeStore.HTTP_STATUS_CREATED) {
                    fetchSizes()
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const updateSize = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/sizes/${currentSizeId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'title': encodeURIComponent(titleSize)})
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === sizeStore.HTTP_STATUS_OK) {
                    fetchSizes()
                    setTitleSize('')
                    setCurrentSizeId(null)
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    useEffect(() => {
        fetchSizes()
    }, [])

    return(
        <div>
            <h2 className="text-center">Subcategories</h2>
            <Button
                onClick={handleSizeAdd}>
                <AddIcon/>
                Add
            </Button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {
                    sizeStore.sizes.map((size) => {
                        return (<tr>
                            <td>{size.id}</td>
                            <td>{size.title}</td>
                            <td>
                                <div>
                                    <Button
                                        style={{marginLeft:'15px'}}
                                        onClick={(e) => {handleSizeEdit(e,size.id)}}>
                                        <EditIcon/>
                                    </Button>
                                    <Button
                                        style={{marginLeft:'15px'}}
                                        onClick={(e) => {handleSizeDelete(e, size.id)}}>
                                        <DeleteIcon/>
                                    </Button>
                                </div>
                            </td>
                        </tr>)
                    })
                }
                </tbody>
            </Table>

            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modalVisibility}>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control id="name"
                                          value={titleSize}
                                          onChange={handleSizeTitleChange}
                                          type="text"
                                          placeholder="Enter title">
                            </Form.Control>
                            {
                                showError ? <div style={{color:'red'}}>{errorMessage}</div> : ''
                            }
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSubmitForm}>Submit</Button>
                    <Button onClick={() => {setModalVisibility(false)
                        setShowError(false)
                    }}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}