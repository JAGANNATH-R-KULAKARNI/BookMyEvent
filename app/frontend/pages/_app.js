import serverOrBrowserRequest from "../helpers/buildRequest";
import NavHeader from '../component/header';

const AppComponent= ({Component,pageProps,currentUser})=>{
//pageProps will be passed to index.js or other components
  return (
    <div>
      <h1>BookMyEvent</h1>
      <NavHeader currentUser={currentUser}/>
      <Component {...pageProps}/>
    </div>
  );
}

AppComponent.getInitialProps=async (appContext)=>{
  console.log(Object.keys(appContext));
 //[ 'AppTree', 'Component', 'router', 'ctx' ]
 //These are the keys present is 'appContext' ,It is different in Custom class '_app.js' 
 //Normal classes have (req,res) in Component but here the valuse are nested in ctx .
 //ctx : {req,res}
 //sooo
 const client=serverOrBrowserRequest(appContext.ctx);
 const {data}=await client.get('/api/users/currentuser');
 console.log(data);
 let pageProps = {};
 if (appContext.Component.getInitialProps) {
   pageProps = await appContext.Component.getInitialProps(appContext.ctx);
   //getInitialProps in index.js is not invoked so we invoke that manually
 }
 return {
  pageProps,
  ...data,
};
//This will go up 'AppComponent'
}

export default AppComponent;
//Its like a thin wrapper to show on the screen
//Its like a global class
// see video 237,238 to understand more
// Its a custom class component

// Server-side rendering (SSR) is an application's 
// ability to convert HTML files on the server into a fully rendered HTML page for the client.

// import serverOrBrowserRequest from "../helpers/buildRequest";
// import NavHeader from '../component/header';
// import React from 'react';

// class AppComponent extends React.Component
// {
//   constructor()
//   {
//     super();
//   }

//   componentDidMount()
//   {
//     console.log('in the constructor lol')
//     console.log(typeof window);
//   }

//   render()
//   {
//     return (
//       <div>
//         Hey lolll
//       </div>
//     );
//   }
// };

// export default AppComponent;