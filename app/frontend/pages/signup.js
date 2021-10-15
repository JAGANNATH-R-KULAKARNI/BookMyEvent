import React from 'react';
import axios from 'axios';

class SignUp extends React.Component
{
  constructor()
  {
    super();
    this.state={
      email : '',
      password : ''
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
   
   const response=await axios.post('/api/users/signup',{
     email : this.state.email,
     password : this.state.password
   })
   .then((u)=>{
   console.log(u);
   })
  .catch((err)=>{
    console.log(err);
  })
   ;
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
      </div>
    );
  }
}

export default SignUp;