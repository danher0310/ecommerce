import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Messages'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import {getUserDetails, updateUsers } from '../actions/userActions'
import {useNavigate, useLocation } from 'react-router-dom' 
import { useParams } from 'react-router-dom'
import {USER_UPDATE_RESET} from '../constants/userConstants'

function EditUserScreen() {
    const dispatch = useDispatch()
    const userId = useParams()
    const [email, setEmail] = useState('') 
    const [name, setName] = useState('')    
    const [isAdmin, setIsAdmin] = useState('')
    const history = useNavigate()


    const userDetails = useSelector(state => state.userDetails)
    const {error, loading, user} = userDetails 
    
    const userUpdate = useSelector(state => state.userUpdate)
    const {error: errorUpdate , loading: loadingUpdate , success: successUpdate} = userUpdate 
    
    

    useEffect(() =>{

        if(successUpdate){
            dispatch({type:USER_UPDATE_RESET})
            history("/admin/userList")
        }else{
            if(!user.name || user.id !== Number(userId.id)){
                dispatch(getUserDetails(userId.id))
                
            }else{
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
                
            }

        }
        
        
    
    }, [user, userId, successUpdate, history ])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUsers({_id: user._id, name, email, isAdmin}))    
        


    }
    
return (
    <div>
        <Link to="/admin/userList">
            Go Back
        </Link>

        <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader/> }
            {errorUpdate && <Message variant={"danger"}>{errorUpdate}</Message>}
            { loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message>
            : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name">
                        <Form.Label> Name</Form.Label>
                        <Form.Control
                            
                            type='text'
                            placeholder="Enter Name"
                            value = {name}
                            onChange={(e) => setName(e.target.value)}
                            >
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId="email">
                        <Form.Label> Email Address</Form.Label>
                        <Form.Control
                            
                            type='email'
                            placeholder="Enter Email"
                            value = {email}
                            onChange={(e) => setEmail(e.target.value)}
                            >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="isAdmin">
                        <Form.Check
                            
                            type='checkBox'
                            label="Is Admin"
                            checked = {isAdmin}
                            onChange={(e) => setIsAdmin (e.target.checked)}
                            >
                        </Form.Check>
                    </Form.Group>

                    
                    <Button className='my-3' type='submit' variant='primary'> 
                        Update
                    </Button>

                </Form>
            )}
            
            

        </FormContainer>

    </div>
        
  )
}

export default EditUserScreen