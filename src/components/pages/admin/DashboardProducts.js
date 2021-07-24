import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearError, setError, setLoading} from "../../../stores/CommonStore";
import {setCategories} from "../../../stores/CategoryStore";
import {setSubcategories} from "../../../stores/SubcategoryStore";
import {setSizes} from "../../../stores/SizeStore";
import {setProducts} from "../../../stores/ProductStore";
import Resizer from 'react-image-file-resizer'
import AddIcon from "@material-ui/icons/Add";
import {Button, Form, Modal, Table} from "react-bootstrap";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

export default function DashboardProducts(){
    const commonStore = useSelector(state => state.CommonStore)
    const categoryStore = useSelector(state => state.CategoryStore)
    const subcategoryStore = useSelector(state => state.SubcategoryStore)
    const sizeStore = useSelector(state => state.SizeStore)
    const productStore = useSelector(state => state.ProductStore)
    const dispatch = useDispatch()

    const [currentProductId, setCurrentProductId] = useState(null)
    const [nameProduct, setNameProduct] = useState('')
    const [descriptionProduct, setDescriptionProduct] = useState('')
    const [priceProduct, setPriceProduct] = useState('')
    const [quantityProduct, setQuantityProduct] = useState(0)
    const [categoryIdProduct, setCategoryIdProduct] = useState(null)
    const [subcategoryIdProduct, setSubcategoryIdProduct] = useState(null)
    const [sizeIdProduct, setSizeIdProduct] = useState(null)
    const [imageProduct, setImageProduct] = useState('')

    const [modalVisibility, setModalVisibility] = useState(false)
    const [showErrorMessage, setShowErrorMessage] = useState(false)

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

    const decodeURIComponentSafe = (s) => {
        if (!s) {
            return s;
        }
        return decodeURIComponent(s.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25'));
    }

    const fetchProducts = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/products`)
            .then((response) => {
                return response.json()
            }).then(responseModel => {
                if(responseModel){
                    if (responseModel.status === 'success') {
                        dispatch(setProducts(JSON.parse(
                            decodeURIComponentSafe(
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
        fetchCategories()
        fetchSubcategories()
        fetchSizes()
        fetchProducts()
    }, [])

    const handleProductNameChange = (e) => {
        setNameProduct(e.target.value)
    }

    const handleProductDescriptionChange = (e) => {
        setDescriptionProduct(e.target.value)
    }

    const handleProductPriceChange = (e) => {
        setPriceProduct(e.target.value)
    }

    const handleProductQuantityChange = (e) => {
        setQuantityProduct(e.target.value)
    }

    const handleProductCategoryIdChange = (e) => {
        if (typeof e.target.value === 'string') {
            setCategoryIdProduct(Number(e.target.value))
        }
    }

    const handleProductSubcategoryIdChange = (e) => {
        if (typeof e.target.value === 'string') {
            setSubcategoryIdProduct(Number(e.target.value))
        }
    }

    const handleProductSizeIdChange = (e) => {
        if (typeof e.target.value === 'string') {
            setSizeIdProduct(Number(e.target.value))
        }
    }

    const handleProductImageChange = (e) => {
        const files = e.currentTarget.files
        if(files){
            const file = files[0]
            if(file){
                resizeFile(file).then((image) => {
                    if (typeof image === 'string') {
                        setImageProduct(image)
                    }
                })
            }
        }
    }

    const resizeFile = (file) => new Promise(resolve => {
        Resizer.imageFileResizer(file, 600, 866, 'JPEG', 100, 0,
            uri => {
                resolve(uri);
            },
            'base64'
        )
    })

    useEffect(() => {
        document.getElementById('productImage')?.setAttribute('src', imageProduct)
    }, [imageProduct])

    const handleProductsAdd = () => {
        setCurrentProductId(null)
        setNameProduct('')
        setDescriptionProduct('')
        setPriceProduct('')
        setQuantityProduct(0)
        setCategoryIdProduct(categoryStore.categories.find((c) => c.id === 1).id.toString() || null)
        setSubcategoryIdProduct(subcategoryStore.subcategories.find((c) => c.id === 1).id.toString() || null)
        setSizeIdProduct(sizeStore.sizes.find((c) => c.id === 1).id.toString() || null)
        setImageProduct('')
        setModalVisibility(true)
    }

    const handleProductEdit = (e, productId) => {
        setModalVisibility(true)
        setCurrentProductId(productId)
        setNameProduct(productStore.products.find((c) => c.id === productId)?.name || '')
        setDescriptionProduct(productStore.products.find((c) => c.id === productId)?.description || '')
        setPriceProduct(parseFloat(productStore.products.find((c) => c.id === productId)?.price).toFixed(2) || 0)
        setQuantityProduct(productStore.products.find((c) => c.id === productId)?.quantity || 0)
        setCategoryIdProduct(productStore.products.find((c) => c.id === productId)?.category.id || null)
        setSubcategoryIdProduct(productStore.products.find((c) => c.id === productId)?.subcategory.id || null)
        setSizeIdProduct(productStore.products.find((c) => c.id === productId)?.size.id || null)
        setImageProduct(productStore.products.find((c) => c.id === productId)?.image || null)
    }

    const handleProductDelete = (e, productId) => {
        setCurrentProductId(productId)
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(commonStore.basename + '/products/' + productId,{
            method: 'DELETE'
        }).then((response) => {
            if (response.status === productStore.HTTP_STATUS_NO_CONTENT) {
                fetchProducts()
                setCurrentProductId(null)
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const handleSubmitForm = (e) => {
        e.preventDefault()

        let regexp = /^\d+\.\d{0,2}$/;
        if((nameProduct.length > 0
            || nameProduct.trim() !== '')
            &&
            (descriptionProduct.length > 0
            || descriptionProduct.trim() !== '')
            && regexp.test(priceProduct)
            && quantityProduct>0){
            if(!currentProductId) {
                addProduct()
            } else {
                updateProduct()
            }
            setModalVisibility(false)
            setShowErrorMessage(false)
        }else{
            setShowErrorMessage(true)
        }
    }

    const addProduct = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(commonStore.basename + '/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'name': encodeURIComponent(nameProduct),
                'description': encodeURIComponent(descriptionProduct),
                'price': priceProduct,
                'quantity': quantityProduct,
                'image': imageProduct,
                'categoryId': categoryIdProduct,
                'subcategoryId': subcategoryIdProduct,
                'sizeId': sizeIdProduct
            })
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === productStore.HTTP_STATUS_CREATED) {
                    fetchProducts()
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const updateProduct = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/products/${currentProductId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'name': encodeURIComponent(nameProduct),
                'description': encodeURIComponent(descriptionProduct),
                'price': priceProduct,
                'quantity': quantityProduct,
                'image': imageProduct,
                'categoryId': categoryIdProduct,
                'subcategoryId': subcategoryIdProduct,
                'sizeId': sizeIdProduct
            })
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === productStore.HTTP_STATUS_OK) {
                    fetchProducts()
                    setNameProduct('')
                    setDescriptionProduct('')
                    setPriceProduct(0)
                    setQuantityProduct(0)
                    setCategoryIdProduct(categoryStore.categories.find((c) => c.id === 1).id.toString() || null)
                    setSubcategoryIdProduct(subcategoryStore.subcategories.find((c) => c.id === 1).id.toString() || null)
                    setSizeIdProduct(sizeStore.sizes.find((c) => c.id === 1).id.toString() || null)
                    setImageProduct('')
                    setCurrentProductId(null)
                }
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    return(
        <div>
            <h2 className="text-center">Products</h2>
            <Button
                onClick={handleProductsAdd}>
                <AddIcon/>
                Add
            </Button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {
                    productStore.products.map((product) => {
                        return (<tr>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price}</td>
                            <td>
                                <div>
                                    <Button
                                        style={{marginLeft:'15px'}}
                                        onClick={(e) => {handleProductEdit(e, product.id)}}>
                                        <EditIcon/>
                                    </Button>
                                    <Button
                                        style={{marginLeft:'15px'}}
                                        onClick={(e) => {handleProductDelete(e, product.id)}}>
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
                            <Form.Control
                                id="title"
                                required
                                type="text"
                                placeholder="Enter title"
                                value={nameProduct}
                                onChange={handleProductNameChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                id="description"
                                required
                                type="text"
                                placeholder="Enter description"
                                value={descriptionProduct}
                                onChange={handleProductDescriptionChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                id="price"
                                required
                                placeholder="Enter price"
                                value={priceProduct}
                                onChange={handleProductPriceChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                id="quantity"
                                type="number"
                                required
                                placeholder="Enter quantity"
                                value={quantityProduct}
                                onChange={handleProductQuantityChange}
                            />
                        </Form.Group>
                        <Form.Group>
                           <Form.Label>Category</Form.Label>
                            <Form.Control
                                id="category"
                                as="select"
                                value={categoryIdProduct}
                                onChange={handleProductCategoryIdChange}>
                                {
                                    categoryStore.categories.map((category) => {
                                        return(
                                            <option value={category.id.toString()}>
                                                {category.name}
                                            </option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Subcategory</Form.Label>
                            <Form.Control
                                id="subcategory"
                                as="select"
                                value={subcategoryIdProduct}
                                onChange={handleProductSubcategoryIdChange}>
                                {
                                    subcategoryStore.subcategories.map((subcategory) => {
                                        return(
                                            <option value={subcategory.id.toString()}>
                                                {subcategory.name}
                                            </option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Size</Form.Label>
                            <Form.Control
                                id="size"
                                as="select"
                                value={sizeIdProduct}
                                onChange={handleProductSizeIdChange}>
                                {
                                    sizeStore.sizes.map((size) => {
                                        return(
                                            <option value={size.id.toString()}>
                                                {size.title}
                                            </option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image</Form.Label>
                            <div>
                                <img alt='product' id='productImage'/>
                            </div>
                            <Form.Control
                                id="img"
                                type="file"
                                required
                                name="file"
                                onChange={handleProductImageChange}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {showErrorMessage? <div style={{color:'red'}}>Invalid data</div>:''}
                    <Button onClick={handleSubmitForm}>Submit</Button>
                    <Button onClick={() => {
                        setModalVisibility(false)
                        setShowErrorMessage(false)
                    }}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}