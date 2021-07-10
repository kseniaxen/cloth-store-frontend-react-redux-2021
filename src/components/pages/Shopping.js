import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import history from '../../history'
import {clearError, setError, setLoading} from "../../stores/CommonStore";
import {setCategories} from "../../stores/CategoryStore";
import {setSubcategories} from "../../stores/SubcategoryStore";
import {setSizes} from "../../stores/SizeStore";
import {
    setCategoriesFilter,
    historyPush,
    setPriceFrom,
    setPriceTo,
    setProducts,
    setQuantityFrom, setQuantityTo, setOrderBy, setSortingDirection, setSubcategoryFilter, setSizeFilter
} from "../../stores/ProductStore";
import {Accordion, Button, Card, Col, Container, Form, Row} from "react-bootstrap";

export default function Shopping(){
    const commonStore = useSelector(state => state.CommonStore)
    const userStore = useSelector(state => state.UserStore)
    const categoryStore = useSelector(state => state.CategoryStore)
    const subcategoryStore = useSelector(state => state.SubcategoryStore)
    const sizeStore = useSelector(state => state.SizeStore)
    const productStore = useSelector(state => state.ProductStore)

    const [searchTitle, setSearchTitle] = useState('')

    let priceFromBound = 0
    let priceToBound = 1000000
    let quantityFromBound = 0
    let quantityToBound = 1000000

    const [keyFilter, setKeyFilter] = useState(false)

    const [searchString, setSearchString] = useState('')

    const dispatch = useDispatch()

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

    const fetchProductPriceBounds = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(commonStore.basename + '/products/price-bounds')
            .then((response) => {
                return response.json()
            }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    priceFromBound = responseModel.data.min
                    priceToBound = responseModel.data.max
                    if (!productStore.priceFrom) {
                        dispatch(setPriceFrom(priceFromBound))
                    }
                    if (!productStore.priceTo) {
                        dispatch(setPriceTo(priceToBound))
                    }
                } else if (responseModel.status === 'fail') {
                    dispatch(setError(responseModel.message))
                }
                dispatch(historyPush())
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const fetchProductQuantityBounds = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(commonStore.basename + '/products/quantity-bounds')
            .then((response) => {
                return response.json()
            }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    quantityFromBound = responseModel.data.min
                    quantityToBound = responseModel.data.max
                    if (!productStore.quantityFrom) {
                        dispatch(setQuantityFrom(quantityFromBound))
                    }
                    if (!productStore.quantityTo) {
                        dispatch(setQuantityTo(quantityToBound))
                    }
                } else if (responseModel.status === 'fail') {
                    dispatch(setError(responseModel.message))
                }
                dispatch(historyPush())
            }
        }).catch((error) => {
            dispatch(setError(error.message))
            throw error
        })
        dispatch(setLoading(false))
    }

    const fetchFilteredProducts = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        const filteredProductsUrl =
            `${commonStore.basename}/products/filtered
                ::orderBy:${productStore.orderBy}
                ::sortingDirection:${productStore.sortingDirection}
                /?search=${searchString}`
        fetch(filteredProductsUrl.replace(/\s/g, ''))
            .then((response) => {
                return response.json()
            }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    dispatch(setProducts(
                        JSON.parse(
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
        fetchProductPriceBounds()
        fetchProductQuantityBounds()
    },[])

    useEffect(() => {
        const windowUrl = window.location.search
        const params = new URLSearchParams(windowUrl)
        const searchString= params.get('search') || ''
        const orderBy = params.get('orderBy') || ''
        const sortingDirection = params.get('sortingDirection') || ''
        setSearchString(searchString)
        if (orderBy) {
            dispatch(setOrderBy(orderBy))
        }
        if (sortingDirection) {
            dispatch(setSortingDirection(sortingDirection))
        }
        fetchFilteredProducts()
        setKeyFilter(false)
    },[keyFilter])

    const handleCategoriesFilter = (e, id) => {
        const categoryId =
            productStore.categoriesFilter.find(categoryId => categoryId === id)
        if (!categoryId && e.target.checked) {
            dispatch(setCategoriesFilter([...productStore.categoriesFilter,id]))
        } else if (categoryId && !e.target.checked) {
            dispatch(setCategoriesFilter(productStore.categoriesFilter.filter(categoryId => categoryId !== id)))
        }
        dispatch(historyPush())
        setKeyFilter(true)
    }

    const handleSubcategoriesFilter = (e, id) => {
        const subcategoryId =
            productStore.subcategoryFilter.find(subcategoryId => subcategoryId === id)
        if (!subcategoryId && e.target.checked) {
            dispatch(setSubcategoryFilter([...productStore.subcategoryFilter,id]))
        } else if (subcategoryId && !e.target.checked) {
             dispatch(setSubcategoryFilter(productStore.subcategoryFilter.filter(subcategoryId => subcategoryId !== id)))
        }
        dispatch(historyPush())
        setKeyFilter(true)
    }

    const handleSizesFilter = (e, id) => {
        const sizeId =
            productStore.sizeFilter.find(sizeId => sizeId === id)
        if (!sizeId && e.target.checked) {
            dispatch(setSizeFilter([...productStore.sizeFilter,id]))
        } else if (sizeId && !e.target.checked) {
            dispatch(setSizeFilter(productStore.sizeFilter.filter(sizeId => sizeId !== id)))
        }
        dispatch(historyPush())
        setKeyFilter(true)
    }

    return(
        <div>
            <Container>
                <Row>
                    <Col xs md="3" lg="2">
                        <Form>
                            <Accordion defaultActiveKey="0">
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            Category
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            {
                                                categoryStore.categories.map((category)=>{
                                                    return(
                                                        <Form.Check
                                                            label={category.name}
                                                            name={'c' + category.id}
                                                            checked={productStore.categoriesFilter.find(categoryId => categoryId === category.id)}
                                                            onChange={(e) => handleCategoriesFilter(e, category.id)}
                                                            type='checkbox'/>
                                                    )
                                                })
                                            }
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Form>
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Clothes
                                    </Accordion.Toggle>
                                </Card.Header>

                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        {
                                            subcategoryStore.subcategories.map((subcategory)=>{
                                                return(
                                                    <Form.Check
                                                        label={subcategory.name}
                                                        name={'s' + subcategory.id}
                                                        checked={productStore.subcategoryFilter.find(subcategoryId => subcategoryId === subcategory.id)}
                                                        onChange={(e) => handleSubcategoriesFilter(e, subcategory.id)}
                                                        type='checkbox'/>
                                                )
                                            })
                                        }
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Sizes
                                    </Accordion.Toggle>
                                </Card.Header>

                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        {
                                            sizeStore.sizes.map((size)=>{
                                                return(
                                                    <Form.Check
                                                        label={size.title}
                                                        name={'s' + size.id}
                                                        checked={productStore.sizeFilter.find(sizeId => sizeId === size.id)}
                                                        onChange={(e) => handleSizesFilter(e, size.id)}
                                                        type='checkbox'/>
                                                )
                                            })
                                        }
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                    <Col>
                        <Row xs={1} md={2} lg={3}>
                            {
                                productStore.products.map(product=> {
                                    return( <Col>
                                            <Card>
                                                <Card.Img variant="top" src={product.image} />
                                                <Card.Body>
                                                    <Card.Title>{product.price} ₴</Card.Title>
                                                    <Card.Subtitle style={{fontSize:'14px'}} className="mb-2 text-muted">{product.name}/{product.subcategory.name}</Card.Subtitle>
                                                    <Card.Text>
                                                        Size - {product.size.title}
                                                    </Card.Text>
                                                    <Button
                                                        variant="primary"
                                                        style={{display: userStore.user ? 'inline' : 'none'}}>
                                                        Add to cart
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}