import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import Messages from './Messages'
import { listTopProducts } from '../actions/productsActions'



function ProductCarrusel() {
    const dispatch = useDispatch()

    const productTopRated = useSelector(state => state.productTopRated)
    const { error, loading, products } = productTopRated

    useEffect(()=> {
        dispatch(listTopProducts())
    }, [dispatch])

  return ( 
    loading ? <Loader/>
    : error ? <Messages variant='danger'>{error}</Messages>
    : (
        <Carousel pause='hover' className='bg-dark'>
            {products.map(product => (
                <Carousel.Item key = {product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid></Image>
                        <Carousel.Caption className='carousel-caption'>
                            <h4>{product.name} (${product.price})</h4>

                        </Carousel.Caption>
                    </Link>

                </Carousel.Item>
            ))}

        </Carousel>
    )

    
  )
}

export default ProductCarrusel