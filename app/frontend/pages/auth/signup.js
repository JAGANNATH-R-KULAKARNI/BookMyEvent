import React from 'react';
import axios from 'axios';
import Router from 'next/router';

class SignUp extends React.Component
{
  constructor()
  {
    super();
    this.state={
      email : '',
      password : '',
      errors : null,
      message : ''
    };
    this.textChangeHandler=this.textChangeHandler.bind(this);
    this.submitTheForm=this.submitTheForm.bind(this);
  }

  textChangeHandler(e)
  {
     this.setState({
       [e.target.name] : e.target.value
     });
  }

  async submitTheForm(e)
  {
   e.preventDefault();

   try{
     const response=await axios.post('/api/users/signup',{
     email : this.state.email,
     password : this.state.password
   });

   this.setState({
     message : 'Successfully signed up :)',
     errors : null
   });

   Router.push('/auth/signin');
  }
   catch(err){
    this.setState({
      errors : err.response.data.errors,
      message : 'Error occured :('
    });
   }
  }

  render()
  {
    return (
      <div>
        <h1>SignUp</h1>
        <form>
          <div>
            <label>Email : </label>
            <input name="email" onChange={this.textChangeHandler}/>
          </div>
          <br/>
          <div>
            <label>Password : </label>
            <input type="password" name="password" onChange={this.textChangeHandler}/>
          </div>
          <br/>
          <div>
            <button onClick={this.submitTheForm}>Submit</button>
          </div>
        </form>
        <br />
        <div>
                {this.state.message}
                <br/>
                <ul>
                {
                  this.state.errors && this.state.errors.map((err)=>{
                    return <li key={err.message}>{err.message}</li>
                  })
                }
                </ul>
        </div>
      </div>
    );
  }
}

export default SignUp;