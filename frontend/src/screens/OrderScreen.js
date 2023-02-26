import React, {useEffect, useState} from 'react'
import {Row, Col, ListGroup, Image, Card, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {Link } from 'react-router-dom'
import Messages from '../components/Messages'
import Loader from '../components/Loader'
import {getOrderDetails, payOrder, deliverOrder} from '../actions/orderAction'
import {useNavigate,useParams} from 'react-router-dom'
import { PayPalButton } from "react-paypal-button-v2";
import{ORDER_PAY_RESET, ORDER_DELIVER_RESET} from '../constants/orderConstants'

function OrderScreen() { 

    const history = useNavigate()

    const orderId = useParams()
    const dispatch = useDispatch()
    const [ sdkReady, setSdkReady] = useState(false)

    
    const orderDetails = useSelector(state => state.orderDetails)     
    const {order, error, loading} = orderDetails

    const orderPay = useSelector(state => state.orderPay)     
    const {loading: loadingPay, success: successPay} = orderPay  

    const orderDeliver = useSelector(state => state.orderDeliver)     
    const {loading: loadingDeliver, success: successDeliver} = orderDeliver 

    const userLogin = useSelector(state => state.userLogin)     
    const {userInfo } = userLogin


    if(!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0 ).toFixed(2)
    }
    
    const addPaypalScript = ()  => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENTID}`
        script.async = true
        script.onload = () =>{
            setSdkReady(true)
        }
        document.body.appendChild(script)

    }
    
    
    useEffect(() =>{
        if(!userInfo){
            history('/login')

        }
        if(! order || successPay || order._id !== Number(orderId.id) || successDeliver){
            dispatch({type: ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVER_RESET})
            dispatch(getOrderDetails(orderId.id))
        }
        else if( !order.isPaid){
            if(!window.paypal){
                addPaypalScript()
            }else{
                setSdkReady(true)
            }

        }
        
    }, [dispatch, order, orderId.id, successPay, successDeliver])
    
    const successPaymentHandler= (paymentResult) => {
        
        dispatch(payOrder(orderId.id, paymentResult))

    }

    const deliverHandler= ( ) => {
        
        dispatch(deliverOrder(order))
    }
    
    
  return loading ? (
    <Loader/>
  ): error ? (
    <Messages variant="danger">{error}</Messages>
  ):(

    <div>
        <h1> Order: {order._id} </h1>
        <Row>
            <Col md={8}>
                <ListGroup variant="flush">                   
                    <ListGroup.Item>
                        <h2>Shipping </h2>
                        <p><strong>Name: </strong>{order.user.name} </p>
                        <p><strong>Email: </strong><a href={`mailto:${order.user.mail}`}>{order.user.email}</a> </p>
                        <p>
                            <strong> Shipping: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}
                            {'     '}
                            {order.shippingAddress.postalCode},
                            {'     '}
                            {order.shippingAddress.country}


                        </p>
                        {order.isDelivered ? (
                            <Messages variant='success'> Delivered on {order.deliveredAt}</Messages>
                        ): (<Messages variant='warning'> Not Delivered</Messages>)}

                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method: </h2>
                        <p>
                            <strong> Method: </strong>

                            {order.paymentMethod}                   
                        </p>
                        {order.isPaid ? (
                            <Messages variant='success'> Paid on {order.paidAt}</Messages>
                        ): (
                        <Messages variant='warning'> Not Paid</Messages>
                        
                        
                        )}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items: </h2>
                        {order.orderItems.length === 0 ?
                            <Messages variant="info">
                                Order is empty
                            </Messages> 
                            :(
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) =>(
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
                                <Col> ${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping: </Col>
                                
                                <Col> ${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax: </Col>
                                <Col> ${order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total: </Col>
                                <Col> ${order.total}</Col>
                            </Row>
                        

                        </ListGroup.Item>

                        {!order.isPaid && (
                            <ListGroup.Item>
                                {loadingPay && <Loader/>}
                                {!sdkReady ? (
                                    <Loader/>
                                ) : (
                                    <PayPalButton
                                        amount={order.total}
                                        onSuccess={successPaymentHandler}
                                    />
                                )}
                            </ListGroup.Item>
                        )}
                        
                    </ListGroup>
                    {loadingDeliver && <Loader></Loader>}
                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered &&(
                        <ListGroup.Item>
                            <Button
                                type = 'button'
                                className='btn btn-block'
                                onClick={deliverHandler}
                            >
                                Mark As Deliver
                            </Button>
                        </ListGroup.Item>
                    )}

                </Card>

            </Col>
        </Row>
    </div>
  )
}

export default OrderScreen