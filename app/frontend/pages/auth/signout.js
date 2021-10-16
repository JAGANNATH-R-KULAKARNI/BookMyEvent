//If we need to signout we need to make the request from user browser not the server because the server son't know about the cookies

import axios from 'axios';
import Router from 'next/router';
import React from 'react';

class SignOut extends React.Component
{
  constructor()
  {
    super();
  }

   async componentDidMount()
   {
  await axios.post('/api/users/signout',{})
  .then((u)=>{
     Router.push('/');
  })
  .catch((err)=>{
 console.log(err);
  });
   }

  render()
  {
    return (
      <div>
      <h1>Signing out.........</h1>
      </div>
    );
  }
};

export default SignOut;