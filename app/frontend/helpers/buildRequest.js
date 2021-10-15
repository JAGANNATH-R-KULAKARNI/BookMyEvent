import axios from 'axios';

const serverOrBrowserRequest=({req})=>{
  
  if(typeof window === 'undefined'){
return axios.create({
  baseURL : 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
  headers : req.headers
});
  }
  else{
    return axios.create({
      baseURL : '/'
    });
  }
}

export default serverOrBrowserRequest;

/*
  //'window' element is only present on browser not in 'node.js container'
if(typeof window === 'undefined'){
  //we are on server

  //see video no 231
  //http://SERVICE_NAME.NAMESPACE.svc.cluster.local
  //To get SERVICE_NAME -> 'kubectl get services -n ingress-nginx'
  //TO get NAMESPACE -> 'kubectl get namespace'
  const {data}=await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',{
    headers : req.headers
  });
  return data;

  //Here we are attempting to do http request inside client container to auth container . So we request to ingress-nginx it forwards it
  //to auth service thenwe get back the response
}
else{
  //we are on browser

  const {data}=await axios.get('/api/users/currentuser');
  return data;
}
*/