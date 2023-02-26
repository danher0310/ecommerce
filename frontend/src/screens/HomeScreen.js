import React, { useEffect} from 'react'
import {Row, Col} from 'react-bootstrap'
import Product from '../components/Product'
//import axios  from 'axios'
import {useDispatch, useSelector} from 'react-redux'
import {listProducts} from '../actions/productsActions'
import Loader from '../components/Loader'
import Messages from '../components/Messages'
import { useLocation } from 'react-router-dom'
import Paginate from '../components/Paginate'
import ProductCarrusel from '../components/ProductCarrusel'
function HomeScreen() {
  //const [products, setproducts] = useState([])
  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const {error, loading, products, page, pages} = productList
  let keyword = useLocation().search
 
  useEffect(() => {
    //async function fetchProducts(){
    //   const {data} = await axios.get('/api/products')
    //   setproducts(data)
    // }
    // // aqui con django encontraremos un error de cors el cual no deja acceder a la api tenemos que configurarlo y descargar la libreria django-cors-headers y configurarlo en settings 
    // fetchProducts()
    dispatch(listProducts(keyword))
  }, [dispatch, keyword])
  return (
    <div>
        {!keyword && <ProductCarrusel/>}
        
        <h1>Latest Products</h1>

        
        {loading ? <Loader />  
          : error ? <Messages variant="danger">{error}</Messages>
          : <div>
              <Row>
                {products.map(product => ( 
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product}/>
                    </Col>
                ))} 
              </Row>
              <Paginate pages={pages} page={page} keyword={keyword}/>
            </div>
        }         
        
    </div>
  )
}

export default HomeScreen