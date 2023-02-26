import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import {Link} from 'react-router-dom'

function Product({product}) {
    return (
        <div>
        <Card className="my-3 p-3 rounded">
            <Link to={`/product/${product._id}`}>
                <Card.Img variant="top" src={product.image} />            
            </Link>
            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as="div">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as ="div">
                    <div className="my-3">
                        <Rating value = {product.raiting} 
                            text={`${product.numReviews} reviews`} 
                            color={'#f8e825'}/>
                    </div>
                </Card.Text>
                <Card.Text as ="a">
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
        </div>
    )
}

export default Product