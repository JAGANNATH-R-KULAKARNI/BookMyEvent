import buildRequest from '../helpers/buildRequest';

const Home=(props)=>{
  console.log(props.currentUser)
  return props.currentUser ? <h1>You have successfully signed In</h1> : <h1>You are not signed In </h1>
};

Home.getInitialProps=async (context)=>{
 const {data}=await buildRequest(context).get('/api/users/currentuser');
 return data;
}
// getInitialProps enables server-side rendering in a page and
//  allows you to do initial data population, 
// it means sending the page with the data already populated from the server. This is especially useful for SEO.

export default Home;

