import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem } from 'react-bootstrap'
import Messages from '../components/Messages'
import {addToCart, removeFromCart} from '../actions/cartActions'
import {useParams, useNavigate, useLocation } from 'react-router-dom' 


function CartScreen() {
  const history = useNavigate()
  const {id} = useParams()
  const qty = useLocation().search.split('=')[1]
    
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart)
  const {cartItems} = cart
  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin 
  

  useEffect(() => {
    if(id){
      dispatch(addToCart(id, qty))
    }
  }, [dispatch, id, qty])
  const removeFromCartHandler = (id) =>{
    dispatch(removeFromCart(id))
  }
  const checkoutHandler = () =>{
    if(userInfo){
      history('/shipping')
    }else{
      history('/login')
    }
  }

  
  return (
    <Row>
      <Col md={8}>
        <h1> Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Messages variant="info">
            Your cart is empty <Link to ="/"> Go to Back</Link>
          </Messages>
        ): (
          <ListGroup variant="flush">
            {cartItems.map(item => (
              <ListGroup.Item key={item.product} >
                <Row> 
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded></Image>                  
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name} </Link>
                  </Col>
                  <Col md={2}>
                    ${item.price}
                  </Col>
                  <Col md={3}>
                    <Form.Control xs="auto" className="my-1"
                      as="select"
                      value={item.qty}
                      onChange={(e) => dispatch(addToCart(item.product , Number(e.target.value)))}
                    >
                      {/* aqui creamos un arreglo con la cantidad de productos que estan en la base da datos lo que hacemos y este sera su maximo   */}
                      {
                        [...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))
                      }
                      
                    </Form.Control>
                  </Col>
                  <Col md={1}>
                      <Button 
                        type='button'
                        variant='ligth'
                        onClick={()=>removeFromCartHandler(item.product) }
                        >
                          <i className="fas fa-trash"></i>
                      </Button>
                  </Col>
                </Row>

              </ListGroup.Item>
            ))}

          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2>Subtotal ({cartItems.reduce((acc,item) => acc + Number(item.qty), Number(0))}) items</h2>
                ${cartItems.reduce((acc,item) => acc + item.qty * item.price, 0).toFixed(2)}
            </ListGroupItem>
            <ListGroupItem>
              <Button
                type="button"
                className="btn-block btn btn-primary btn-lg"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
                >
                  PROCEED TO CHECKOUT
              </Button>
            </ListGroupItem>

          </ListGroup>

        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen