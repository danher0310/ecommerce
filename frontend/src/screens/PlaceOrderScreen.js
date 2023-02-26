import React, {useEffect, useState} from 'react'
import {Button, Row, Col, ListGroup, Image, Card} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {Link } from 'react-router-dom'
import Messages from '../components/Messages'
import CheckOutSteps from '../components/CheckOutSteps'
import {createOrder} from '../actions/orderAction'
import {useNavigate} from 'react-router-dom'
import {ORDER_CREATE_RESET} from '../constants/orderConstants'

function PlaceOrderScreen() {
    const dispatch = useDispatch()
    const history = useNavigate()
    const orderCreate = useSelector(state => state.orderCreate)
    
    const {order, error, success} = orderCreate
    const cart = useSelector(state => state.cart)
    
    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0 ).toFixed(2)
    cart.shippingPrice = Number(cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
    cart.taxPrice = Number((0.082) * cart.itemsPrice).toFixed(2)
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2) 
    
    
    useEffect(() =>{
        if(!cart.paymentMethod){
            history('/payment')
        }
        else if(success){
            history(`/order/${order._id}`)
            dispatch({type: ORDER_CREATE_RESET})
        }
    }, [success, history])
    
    const placeOrder = () =>{ 
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice:cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice

        }))
    }
    
  return (

    <div>
        <CheckOutSteps step1 step2 step3 step4/>
        <Row>
            <Col md={8}>
                <ListGroup variant="flush">                   
                    <ListGroup.Item>
                        <h2>Shipping </h2>
                        <p>
                            <strong> Shipping: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}
                            {'     '}
                            {cart.shippingAddress.postalCode},
                            {'     '}
                            {cart.shippingAddress.country}


                        </p>

                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method: </h2>
                        <p>
                            <strong> Method: </strong>
                            {cart.paymentMethod}                   
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items: </h2>
                        {cart.cartItems.length === 0 ?
                            <Messages variant="info">
                                Your cart is empty
                            </Messages> 
                            :(
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) =>(
                                        <ListGroup.Item key={item.product}>
                                            <Row >
                                                <Col md={2}>
                                                    <Image src={item.image} alt={item.name} fluid rounded></Image>
                                                </Col>
                                                <Col md={4}>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} X ${item.price}={(item.qty * item.price).toFixed(2)}
                                                </Col>

                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )
                        }

                        
                    </ListGroup.Item>

                </ListGroup>

            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup>
                        <ListGroup.Item>
                            <h2>Order Summary:</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Item: </Col>
                                <Col> ${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping: </Col>
                                <Col> ${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax: </Col>
                                <Col> ${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total: </Col>
                                <Col> ${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        {error && <Messages variant='danger'>{error}</Messages>
                        }
                        <ListGroup.Item>

                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button 
                                type='button'
                                className='btn-block'
                                onClick={placeOrder} 
                            >
                                Place Order
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>

                </Card>

            </Col>
        </Row>
    </div>
  )
}

export default PlaceOrderScreen