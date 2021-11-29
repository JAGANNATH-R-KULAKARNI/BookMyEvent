import nats,{Stan} from 'node-nats-streaming';

class NatsWrapper{
 
  private _client?:Stan; //'?' signifies client variable can be temporarily undefined
  
  get client(){
    if(!this._client){
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
   }
  connect(clusterId : string,clientId : string,url : string){
    this._client=nats.connect(clusterId,clientId,{url});

     //We use Promise to make async requests
    return new Promise<void>((resolve,reject)=>{

      //It will call get client method
      this.client.on('connect',()=>{
           console.log('Connected to NATS');
           resolve(); 
      });

      this.client.on('error',(err)=>{
        console.log('Failed to connect to NATS');
         reject(err);
      });

    });
  }
}


export const natsWrapper=new NatsWrapper();