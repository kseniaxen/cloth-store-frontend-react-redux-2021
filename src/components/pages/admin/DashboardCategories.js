import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearError, setError, setLoading} from "../../../stores/CommonStore";
import {setCategories} from "../../../stores/CategoryStore";
import {Button, Form, Modal, Table} from "react-bootstrap";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

export default function DashboardCategories(){
    const commonStore = useSelector(state => state.CommonStore)
    const categoryStore = useSelector(state => state.CategoryStore)
    const dispatch = useDispatch()

    const [modalVisibility, setModalVisibility] = useState(false)
    const [nameCategory, setNameCategory] = useState('')
    const [currentCategoryId, setCurrentCategoryId] = useState(null)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleCategoryAdd = (e) => {
        setCurrentCategoryId(null)
        setNameCategory('')
        setModalVisibility(true)
    }

    const handleCategoryNameChange = (e) => {
        setNameCategory(e.target.value)
    }

    const handleCategoryEdit = (e, categoryId) => {
        setModalVisibility(true)
        setCurrentCategoryId(categoryId)
        setNameCategory(categoryStore.categories.find((c) => c.id === categoryId)?.name || '')
    }

    const handleCategoryDelete = (e, categoryId) => {
        setCurrentCategoryId(categoryId)
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/categories/${categoryId}`,{
            method: 'DELETE'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    fetchCategories()
                    setCurrentCategoryId(null)
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
        if(nameCategory.length > 0 && nameCategory.trim() !== ''){
            if(categoryStore.categories.find((c) => c.name === nameCategory) !== undefined){
                setShowError(true)
                setErrorMessage('This name is already takes')
            }else{
                if(!currentCategoryId) {
                    addCategory()
                } else {
                    updateCategory()
                }
                setModalVisibility(false)
                setShowError(false)
            }
        }else{
            setShowError(true)
            setErrorMessage('Invalid name')
        }
    }

    const fetchCategories = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/categories`,{
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    dispatch(setCategories(JSON.parse(
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

    const addCategory = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/categories`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': encodeURIComponent(nameCategory)})
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === categoryStore.HTTP_STATUS_CREATED) {
                    fetchCategories()
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const updateCategory = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/categories/${currentCategoryId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': encodeURIComponent(nameCategory)})
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === categoryStore.HTTP_STATUS_OK) {
                    fetchCategories()
                    setNameCategory('')
                    setCurrentCategoryId(null)
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return(
        <div>
            <h2 className="text-center">Categories</h2>
            <Button
                    onClick={handleCategoryAdd}>
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
                    categoryStore.categories.map((category) => {
                        return (<tr>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>
                                <div>
                                    <Button
                                        style={{marginLeft:'15px'}}
                                        onClick={(e) => {handleCategoryEdit(e,category.id)}}>
                                        <EditIcon/>
                                    </Button>
                                    <Button
                                        style={{marginLeft:'15px'}}
                                        onClick={(e) => {handleCategoryDelete(e, category.id)}}>
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
                                              value={nameCategory}
                                              onChange={handleCategoryNameChange}
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