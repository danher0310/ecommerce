import React, {useState, useEffect} from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table, Button, Row, Col} from 'react-bootstrap'
import Loader from '../components/Loader'
import { useLocation, useNavigate } from 'react-router-dom' 
import Message from '../components/Messages'
import { useDispatch, useSelector } from 'react-redux'
import {listProducts, deletePoduct, createPoduct} from '../actions/productsActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import Paginate from '../components/Paginate'

function ProductListScreen() {

    const history = useNavigate()
    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const {error, loading, products, page, pages} = productList

    const productDelete = useSelector(state => state.productDelete)
    const {error: errorDelete, loading: loadingDelete, success: successDelete} = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const {error: errorCreate, loading: loadingCreate, success: successCreate, product: createdProduct} = productCreate

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin


    let keyword = useLocation().search
    console.log(keyword)

    useEffect(() => {
        dispatch({type: PRODUCT_CREATE_RESET})
        if(!userInfo.isAdmin){
            history("/login")
            
            
        }
        if(successCreate){
            history(`/admin/product/${createdProduct._id}/edit`)
        }else{
            dispatch(listProducts(keyword))
        }
        

    }, [ dispatch, history, userInfo, successDelete, successCreate, keyword  ])

    const deleteHandler = (id)  =>{
        if(window.confirm('Are you want to delete this  product?')){
            dispatch(deletePoduct(id))
            
        }
        
    }

    const createProductHandler = (product) =>{
        dispatch(createPoduct())


    }
    
    return (
    <div>
        <Row className='alig-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-align-end'>
                <Button className='my-3' onClick = {createProductHandler}>
                    <i className='fas fa-plus'></i> Create Product
                </Button>
            </Col>

        </Row>
        {loadingDelete && <Loader/>  }
        {errorDelete && <Message variant='danger'>errorDelete</Message>   }
        {loadingCreate && <Loader/>  }
        {errorCreate && <Message variant='danger'>errorCreate</Message>   }
        {loading 
        ? (<Loader/>)
        :error 
            ? (<Message variant="danger"> {error} </Message>)
            : ( <div>
                    <Table striped bordered hover responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>PRICE</th>
                                <th>CATEGORY </th>
                                <th>BRAND </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant="ligth" className="btn-sm">
                                                <i className='fas fa-edit'></i>
                                            </Button>

                                        </LinkContainer>

                                        <Button variant="danger" className="btn-sm" onClick = {() => deleteHandler(product._id)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                        
                    </Table>
                    <Paginate pages ={pages} page={page} isAdmin={true}/>
                </div>
            ) }

    </div>
  )
}

export default ProductListScreen