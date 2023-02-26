import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function Paginate({pages, page, keyword='', isAdmin= false}) {
    if(keyword){
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }
    console.log('key', keyword)
    
  return (
     pages > 1 &&(
        <Pagination>
            
            {[...Array(pages).keys()].map((x)=> (
                <LinkContainer 
                
                    key={x+1}
                    // to={!isAdmin ? 
                    //     `/`
                    //     : `/admin/productlist/?keyword=${keyword}&page=${x+1}`
                    // }
                    to={!isAdmin ?{
                        pathname: "/",
                        search:`?keyword=${keyword}&page=${x+1}`

                    }:{
                        pathname: "/admin/productlist/",
                        search:`?keyword=${keyword}&page=${x+1}`
                    }}
                    >
                    
                    <Pagination.Item active={x+1 === page} >{x+1}</Pagination.Item>
                </LinkContainer>
                
            )) }
            {/*aqui creamos los botones de paginacion convertimos la variable pages en arreglo, y en key colocamos x +1 ya que los arreglos inician en 0 se pueda ver como el numero 1 */}
        </Pagination>
     )
  )
}

export default Paginate