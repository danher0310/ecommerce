import React, {useState, useEffect} from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table, Button} from 'react-bootstrap'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom' 
import Message from '../components/Messages'
import { useDispatch, useSelector } from 'react-redux'
import {listOrders} from '../actions/orderAction'

function OrderListScreen() {

    const history = useNavigate()
    const dispatch = useDispatch()

    const orderList = useSelector(state => state.orderList)
    const {loading, error, orders} = orderList

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    
    useEffect(() => {
        if(userInfo && userInfo.isAdmin){
            dispatch(listOrders())
            console.log(history)
        }else{
            history("/login")
            console.log(history)
        }
        

    }, [ dispatch, history, userInfo ])

    

    return (
    <div>
        <h1>Orders</h1>
        {loading 
        ? (<Loader/>)
        :error 
            ? (<Message variant="danger"> {error} </Message>)
            : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Total </th>
                            <th>Paid </th>
                            <th>Delivered</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name }</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>${order.total}</td>
                                <td>{order.isPaid ? (
                                    order.paidAt.substring(0,10)
                                ):(<i className='fa fa-check' style={{color: 'red'}} ></i>)}
                                </td>
                                <td>{order.isDelivered ? (
                                    order.deliveredAt.substring(0,10)
                                ):(<i className='fa fa-check' style={{color: 'red'}} ></i>)}
                                </td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}/`}>
                                        <Button variant="ligth" className="btn-sm">
                                            Details
                                        </Button>

                                    </LinkContainer>

                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) }

    </div>
  )
}

export default OrderListScreen