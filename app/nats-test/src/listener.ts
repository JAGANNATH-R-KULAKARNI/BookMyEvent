import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import {TicketCreatedListener} from './events/ticketCreatedListener';

console.clear();//clears the console

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');
  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true) //If an event is received acknoledgment is created(by default if we loses db then no acknolegment is saved so we give this option.)
  //   .setDeliverAllAvailable()//Get a list of all the elements that has ever been emitted in the past, This is used only very first time when we haven't processed any events
  //   .setDurableName('accounting-service');//All the unprocessed events are processedo once the service comes online

    stan.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

  // const subsricbtion=stan.subscribe('ticket:created',
  // 'orders-service-queue-group',  //This is a queue-group and if two services are created of this type then NATS server sends event to any one of them
  // options
  // );

  // subsricbtion.on('message',(msg : Message)=>{
  //   console.log('Message recieved');
  //   const data=msg.getData();

  //   if(typeof data === 'string'){
  //     console.log(`Received Event #${msg.getSequence()}, with data: ${data}`)
  //   }

  //   msg.ack();
  // })

  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

// abstract class Listener{
//   abstract subject:string;
//   abstract queueGroupName : string;
//   abstract onMessage(data : any,msg :Message):void;
//   private client :Stan;
//   protected ackWait=5*1000;//5 seconds

//   constructor(client : Stan){
//     this.client=client;
//   }
  
//   subscriptionOptions(){
//     return this.client
//     .subscriptionOptions()
//     .setDeliverAllAvailable()//Get a list of all the elements that has ever been emitted in the past, This is used only very first time when we haven't processed any events
//     .setManualAckMode(true)//If an event is received acknoledgment is created(by default if we loses db then no acknolegment is saved so we give this option.)
//     .setAckWait(this.ackWait)//Maximum time client will wait to recieve the scknoledgment
//     .setDurableName(this.queueGroupName);//All the unprocessed events are processedo once the service comes online
//   }

//   listen(){
//     const subscription=this.client.subscribe(
//       this.subject,
//       this.queueGroupName,//This is a queue-group and if two services are created of this type then NATS server sends event to any one of them
//       this.subscriptionOptions()
//     );

//      subscription.on('message',(msg : Message) =>{
//       console.log(`Message received : ${this.subject} / ${this.queueGroupName}`);
//       const parsedData=this.parseMessage(msg);
//       this.onMessage(parsedData,msg);
//      });
//       }

//       parseMessage(msg : Message){
//         const data=msg.getData();

//         return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf-8'));
//       }
//   }

//   class TicketCreatedListener extends Listener{
//     subject='ticket:created';
//     queueGroupName='payment-service';


//     onMessage(data : any,msg : Message){
//       console.log('Event data ',data);

//       msg.ack();
//     }
//   }