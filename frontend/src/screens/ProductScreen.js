import React, {useEffect, useState }from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Button, Card, Form, ListGroupItem } from 'react-bootstrap'
import Rating from '../components/Rating'
//import axios  from 'axios'
import {useParams, useNavigate } from 'react-router-dom' 
import {useDispatch, useSelector} from 'react-redux'
import {listProductDetails, createProductReview} from '../actions/productsActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import Loader from '../components/Loader'
import moment from 'moment'
import Messages from '../components/Messages'




function ProductScreen(props) {
  const [qty, setQty] = useState(1)
  const [raiting, setRaiting] = useState(0)
  const [comment, setComment] = useState("")
  const history = useNavigate()
  const {id} = useParams()

  //const [product, setproduct] = useState([])
  const dispatch = useDispatch()
  const productDetails = useSelector(state => state.productDetails)
  const {loading, error, product} = productDetails
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  

  const productReviewCreate = useSelector(state => state.productReviewCreate)
  const {loading: loadingProductReview, 
    error : errorProductReview, 
    success: successProductReview } = productReviewCreate

  useEffect(() => {
    // async function fetchProduct(){
    //   const {data} = await axios.get(`/api/products/${id}`)
    //   setproduct(data)
    // }
    // aqui con django encontraremos un error de cors el cual no deja acceder a la api tenemos que configurarlo y descargar la libreria django-cors-headers y configurarlo en settings 
    //fetchProduct()

    if(successProductReview){
      setRaiting(0)
      setComment('')
      dispatch({type:  PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch(listProductDetails(id))
  }, [dispatch,id, successProductReview])

  const addToCartHandler = () => {
    history(`/cart/${id}?qty=${Number(qty)}`)
  }
   
  const submitHandler = (e) =>{
      e.preventDefault()
      dispatch(createProductReview(id, {
        raiting,
        comment
      } ))
  }
  return (
    <div>
      
      <Link to='/' className='btn btn-dark my-3'> Go Back</Link>
      {loading ? <Loader />  
          : error ? <Messages variant="danger">{error}</Messages>
          : (<div>
              <Row>
                <Col md={6}>
                  <Image src={product.image} alt={product.name} fluid/>
                </Col>
                <Col md={3}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h3>{product.name}</h3>                
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} 
                        color={'#f8e825'}/>
                    </ListGroup.Item> 
                    <ListGroup.Item>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Description: {product.description}             
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={3}>
                  <Card>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col>Price:</Col>
                          <Col>
                            <strong>${product.price}</strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                        <Col>Status:</Col>
                          <Col>
                            <strong>{product.countInStock > 0 ? 'In Stock' : 'Out Stock'}</strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      {product.countInStock > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col>Qty:</Col>
                            <Col>
                              <Form.Control xs="auto" className="my-1"
                                as="select"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                              >
                                {/* aqui creamos un arreglo con la cantidad de productos que estan en la base da datos lo que hacemos y este sera su maximo   */}
                                {
                                  [...Array(product.countInStock).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  ))
                                }
                                
                              </Form.Control>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      )}

                      <ListGroup.Item className='d-grid gap-2'>
                        <Button 
                          onClick ={addToCartHandler}
                          size='lg' 
                          className='btn-block' disabled= {product.countInStock === 0 }type="button"> Add to Cart</Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <h4> Reviews</h4>
                  {product.reviews.length === 0 &&<Messages variant="info"> Not Review</Messages> }
                  <ListGroup variant="flush">
                    {product.reviews.map((review)=>(
                      <ListGroup.Item key = {review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.raiting} color="#f8e825"/>                        
                        <p>{review.comment}</p> 
                        <p>{moment(review.createdAt).fromNow()}</p> 
                      </ListGroup.Item>
                    ))}
                      <ListGroup.Item>
                        
                        <h4>Write a Review </h4>
                        {loadingProductReview && <Loader/>}
                        {successProductReview && <Messages variant="success">Review Submitted</Messages> }
                        {errorProductReview && <Messages variant="danger">{errorProductReview}</Messages> }
                        
                        {userInfo? (
                          <Form onSubmit={submitHandler}>
                            <Form.Group controlId='raiting'>
                              <Form.Label>Raiting</Form.Label>
                              <Form.Control 
                              as='select'
                              value={raiting}
                              onChange = {(e) => setRaiting(e.target.value)}
                              > 
                                <option value="">Select...</option>
                                <option value="1">1 - Poor</option>
                                <option value="2">2 - Fair</option>
                                <option value="3">3 - Good</option>
                                <option value="4">4 - Very Good</option>
                                <option value="5">5 - Excelent</option>
                              </Form.Control>
                            </Form.Group>
                            
                            <Form.Group controlId="comment">
                              <Form.Label>Review</Form.Label>
                              <Form.Control
                                as='textarea'
                                row= '5' 
                                value = {comment}
                                onChange = {(e) => setComment(e.target.value)}

                              >
                              </Form.Control>                          

                            </Form.Group>
                            <Button 
                              disabled = {loadingProductReview}
                              type = "submit"
                              variant = 'primary'
                              >
                              Submit
                            </Button>

                          </Form>
                        ):(
                          <Messages varian='info'>Please <Link to="/login">Login</Link> to write a review</Messages>
                        )}
                      </ListGroup.Item>



                  </ListGroup>
                </Col>
              </Row>
            </div>
          )  
      }

      
    </div>
  )
}

export default ProductScreen