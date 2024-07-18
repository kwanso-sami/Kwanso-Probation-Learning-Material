import React,{useContext} from 'react'
import UserContext from "../../context/UserContext";



function User() {
  const { user} = useContext(UserContext);
  return (
    <div className='py-5 text-3xl text-center text-black bg-orange-500'
    
    >
      
      User Name: {user.name}
      <br/>
      User Email: {user.email}
    
    </div>
  )
}

export default User