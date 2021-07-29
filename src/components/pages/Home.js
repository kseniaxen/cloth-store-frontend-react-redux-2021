import React, {useEffect} from "react";
import {Button, Card, CardGroup, Carousel, Col, Row} from "react-bootstrap";
import sliderImg1 from "../../images/sliderImg1.jpg"
import sliderImg2 from "../../images/sliderImg2.jpg"
import sliderImg3 from "../../images/sliderImg3.jpg"
import {Typography} from "@material-ui/core";

import {useDispatch, useSelector} from "react-redux";
import {clearError, setError, setLoading} from "../../stores/CommonStore";
import {setProducts} from "../../stores/ProductStore";
import {setCartItems, setCartStatusResponse} from "../../stores/CartStore";

export default function Home(){
    const commonStore = useSelector(state => state.CommonStore)
    const userStore = useSelector(state => state.UserStore)
    const productStore = useSelector(state => state.ProductStore)
    const cartStore = useSelector(state => state.CartStore)

    const dispatch = useDispatch()

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
        fetchProducts()
    },[])

    const addToCart = (productId) => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/cart/` + productId,{
            method: 'POST',
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    // запрос на получение всех элементов с сервера
                    fetchCartItems()
                    dispatch(setCartStatusResponse(responseModel.status))
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

    const fetchCartItems = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/cart`, {
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    dispatch(setCartItems(
                        JSON.parse(
                            decodeURIComponent(
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

    const handleAddToCart = (e, productId) => {
        if(cartStore.cartItems.find(product => product.productId === productId) === undefined ||
            (cartStore.cartItems.find(product => product.productId === productId).quantity <
                (productStore.products.find(product => product.id === productId).quantity)
            )
        ) {
            addToCart(productId)
        }else{
            dispatch(setCartStatusResponse('warning'))
        }
    }

    return(
        <div>
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={sliderImg1}
                        alt="image"
                    />
                    <Carousel.Caption>
                        <h3>Shopping</h3>
                        <p>Buy what you wanted for a long time</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={sliderImg2}
                        alt="image"
                    />

                    <Carousel.Caption>
                        <h3>For women</h3>
                        <p>Womens clothing</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={sliderImg3}
                        alt="image"
                    />

                    <Carousel.Caption>
                        <h3>For men</h3>
                        <p>Mens clothing</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <div style={{marginTop:'20px'}}>
                <Typography variant="h5" component="h3">
                    For women
                </Typography>
                <Row lg={4} md={4} xs={2}>
                    {
                        productStore.products.filter(prod => prod.category.id === 1).slice(0,4).map(product => {
                            return <Col>
                                    <Card>
                                        <Card.Img variant="top" src={product.image} />
                                        <Card.Body>
                                            <Card.Title>{product.price} ₴</Card.Title>
                                            <Card.Subtitle style={{fontSize:'14px'}} className="mb-2 text-muted">{product.name}/{product.subcategory.name}</Card.Subtitle>
                                            <Button
                                                variant="primary"
                                                style={{display: userStore.user ? 'inline' : 'none'}}
                                                onClick={(e) => {
                                                    handleAddToCart(e, product.id)
                                                }
                                                }>
                                                Add to cart
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                        })
                    }
                </Row>
            </div>
            <div style={{marginTop:'20px'}}>
                <Typography variant="h5" component="h3">
                    For men
                </Typography>
                <Row lg={4} md={4} xs={2}>
                    {
                        productStore.products.filter(prod => prod.category.id === 2).slice(0,4).map(product => {
                            return <Col>
                                <Card>
                                    <Card.Img variant="top" src={product.image} />
                                    <Card.Body>
                                        <Card.Title>{product.price} ₴</Card.Title>
                                        <Card.Subtitle style={{fontSize:'14px'}} className="mb-2 text-muted">{product.name}/{product.subcategory.name}</Card.Subtitle>
                                        <Button
                                            variant="primary"
                                            style={{display: userStore.user ? 'inline' : 'none'}}
                                            onClick={(e) => {
                                                handleAddToCart(e, product.id)
                                            }
                                            }>
                                            Add to cart
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        })
                    }
                </Row>
            </div>
        </div>
    )
}