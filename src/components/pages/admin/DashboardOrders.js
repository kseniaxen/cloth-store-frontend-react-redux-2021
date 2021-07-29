import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ListGroup, Table} from "react-bootstrap";
import {clearError, setError, setLoading} from "../../../stores/CommonStore";

export default function DashboardOrders() {
    const commonStore = useSelector(state => state.CommonStore)
    const dispatch = useDispatch()
    const [orders, setOrders] = useState([])

    const fetchOrders = () => {
        dispatch(clearError())
        dispatch(setLoading(true))
        fetch(`${commonStore.basename}/cart/not_pay`,{
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    setOrders(responseModel.data)
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
        fetchOrders()
    }, [])

    return(
        <div>
            <h2 className="text-center">Orders</h2>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>UserId</th>
                    <th>CartItems</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {
                    orders.map(order => {
                        return(
                            <tr>
                                <td>{order.id}</td>
                                <td>{order.userId}</td>
                                <td>
                                    <ListGroup>{order.cartItems.map(cart => {
                                        return( <ListGroup.Item>
                                            ProductId: {cart.productId} Quantity: {cart.quantity} Price: {cart.price}
                                            </ListGroup.Item>)

                                })}
                                    </ListGroup>
                                </td>
                                <td>{order.status}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
        </div>
    )
}