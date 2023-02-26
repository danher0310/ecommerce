import React, {useState, useEffect} from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table, Button} from 'react-bootstrap'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom' 
import Message from '../components/Messages'
import { useDispatch, useSelector } from 'react-redux'
import {listUsers, deleteUsers} from '../actions/userActions'

function UserListScreen() {

    const history = useNavigate()
    const dispatch = useDispatch()

    const userList = useSelector(state => state.userList)
    const {loading, error, users} = userList

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const {success: successDelete} = userDelete
     
    useEffect(() => {
        if(userInfo && userInfo.isAdmin){
            dispatch(listUsers())
            console.log(history)
        }else{
            history("/login")
            console.log(history)
        }
        

    }, [ dispatch, history, userInfo, successDelete ])

    const deleteHandler = (id)  =>{
        if(window.confirm('Are you want to delete this user?')){
            dispatch(deleteUsers(id))
        }
        
    }

    return (
    <div>
        <h1>Users</h1>
        {loading 
        ? (<Loader/>)
        :error 
            ? (<Message variant="danger"> {error} </Message>)
            : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? (
                                    <i className='fa fa-check' style={{color: 'green'}} ></i>
                                ):(<i className='fa fa-check' style={{color: 'red'}} ></i>)}
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant="ligth" className="btn-sm">
                                            <i className='fas fa-edit'></i>
                                        </Button>

                                    </LinkContainer>

                                    <Button variant="danger" className="btn-sm" onClick = {() => deleteHandler(user._id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) }

    </div>
  )
}

export default UserListScreen