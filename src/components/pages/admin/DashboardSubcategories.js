import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearError, setError, setLoading} from "../../../stores/CommonStore";
import {setSubcategories} from "../../../stores/SubcategoryStore";
import {Button, Form, Modal, Table} from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

export default function DashboardSubcategories(){
    const commonStore = useSelector(state => state.CommonStore)
    const subcategoryStore = useSelector(state => state.SubcategoryStore)
    const dispatch = useDispatch()

    const [modalVisibility, setModalVisibility] = useState(false)
    const [nameSubcategory, setNameSubcategory] = useState('')
    const [currentSubcategoryId, setCurrentSubcategoryId] = useState(null)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const handleSubcategoryAdd = (e) => {
        setCurrentSubcategoryId(null)
        setNameSubcategory('')
        setModalVisibility(true)
    }

    const handleSubcategoryNameChange = (e) => {
        setNameSubcategory(e.target.value)
    }

    const handleSubcategoryEdit = (e, subcategoryId) => {
        setModalVisibility(true)
        setCurrentSubcategoryId(subcategoryId)
        setNameSubcategory(subcategoryStore.subcategories.find((c) => c.id === subcategoryId)?.name || '')
    }

    const handleSubcategoryDelete = (e, subcategoryId) => {
        setCurrentSubcategoryId(subcategoryId)
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/subcategories/${subcategoryId}`,{
            method: 'DELETE'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    fetchSubcategories()
                    setCurrentSubcategoryId(null)
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
        if(nameSubcategory.length > 0){
            if(subcategoryStore.subcategories.find((c) => c.name === nameSubcategory) !== undefined) {
                setShowError(true)
                setErrorMessage('This name is already takes')
            }else{
                if (!currentSubcategoryId) {
                    addSubcategory()
                } else {
                    updateSubcategory()
                }
                setModalVisibility(false)
                setShowError(false)
            }
        }else{
            setShowError(true)
            setErrorMessage('Invalid name')
        }
    }

    const fetchSubcategories = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/subcategories`,{
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    dispatch(setSubcategories(JSON.parse(
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

    const addSubcategory = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/subcategories`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': encodeURIComponent(nameSubcategory)})
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === subcategoryStore.HTTP_STATUS_CREATED) {
                    fetchSubcategories()
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const updateSubcategory = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/subcategories/${currentSubcategoryId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': encodeURIComponent(nameSubcategory)})
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === subcategoryStore.HTTP_STATUS_OK) {
                    fetchSubcategories()
                    setNameSubcategory('')
                    setCurrentSubcategoryId(null)
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    useEffect(() => {
        fetchSubcategories()
    }, [])

    return(
        <div>
            <h2 className="text-center">Subcategories</h2>
            <Button
                onClick={handleSubcategoryAdd}>
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
                    subcategoryStore.subcategories.map((subcategory) => {
                        return (<tr>
                            <td>{subcategory.id}</td>
                            <td>{subcategory.name}</td>
                            <td>
                                <div>
                                    <Button
                                        onClick={(e) => {handleSubcategoryEdit(e,subcategory.id)}}>
                                        <EditIcon/>
                                    </Button>
                                    <Button
                                        style={{marginLeft:'15px'}}
                                        onClick={(e) => {handleSubcategoryDelete(e, subcategory.id)}}>
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
                            <Form.Label>Name</Form.Label>
                            <Form.Control id="name"
                                          value={nameSubcategory}
                                          onChange={handleSubcategoryNameChange}
                                          type="text"
                                          placeholder="Enter name">
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