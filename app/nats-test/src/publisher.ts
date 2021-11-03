import nats from 'node-nats-streaming';
import {TicketCreatedPublisher} from './events/ticketCreatedPublisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {             //This is client listening and connects to nats streaming server
  url: 'http://localhost:4222',
});


stan.on('connect', async () => {                //This runs only after client(stan) successfully connects to nats streaming server
  console.log('Publisher connected to NATS');  //Instead of async we are using event driven approcach

  const publisher=new TicketCreatedPublisher(stan);
  
  try{
    await publisher.publish({
      id : '123',
      title : 'Jagannath concert',
      price : 20,
      userId : 'asjso72nmakalk'
     });
  }
 catch(err){
   console.log(err);
 }
});