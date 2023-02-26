import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Messages'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import {register} from '../actions/userActions'
import {useNavigate, useLocation } from 'react-router-dom' 
function RegisterScreen() {
    const [email, setEmail] = useState('') 
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const history = useNavigate()
    const dispatch = useDispatch()
    const redirect = useLocation.search ? useLocation.search.split('=')[1]: '/'
    const userRegister = useSelector(state => state.userRegister)
    const {error, loading, userInfo} = userRegister
    

    useEffect(() =>{
        if(userInfo){
            history(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        if(password !== confirmPassword){ 
            setMessage('Passwords do not match')
        }
        else{
            dispatch(register(name, email, password))
        }
        


    }
    
return (
    <FormContainer>
         <h1>Register</h1>
         {message && <Message variant='danger'> {message} </Message>  }
        {error && <Message variant='danger'> {error} </Message> }
        {loading && <Loader/> }
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
                <Form.Label> Name</Form.Label>
                <Form.Control
                    requiered ='true'
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
                    requiered = 'true'
                    type='email'
                    placeholder="Enter Email"
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                    >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label> Password</Form.Label>
                <Form.Control
                    requiered = 'true'
                    type='Password'
                    placeholder="Enter Pasword"
                    value = {password}
                    onChange={(e) => setPassword (e.target.value)}
                    >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword">
                <Form.Label> Confirm Password</Form.Label>
                <Form.Control
                    requiered = 'true'
                    type='password'
                    placeholder="Confirm Pasword"
                    value = {confirmPassword}
                    onChange={(e) => setConfirmPassword (e.target.value)}
                    >
                </Form.Control>

            </Form.Group>
            <Button className='my-3' type='submit' variant='primary'> 
                Register 
            </Button>

        </Form>
        <Row className="py-3">
            <Col>
                Have an account ?  
                <Link to={redirect ? '/login':`/register?redirect=${redirect}` }>
                    Sign In
                </Link>
            </Col>

        </Row>

    </FormContainer>
  )
}

export default RegisterScreen