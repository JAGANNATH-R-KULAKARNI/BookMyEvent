import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();//clears the console

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true); //If an event is received acknoledgment is created(by default if we loses db then no acknolegment is saved so we give this option)
   
    stan.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

  const subsricbtion=stan.subscribe('ticket:created',
  'orders-service-queue-group',  //This is a queue-group and if two services are created of this type then NATS server sends event to any one of them
  options
  );

  subsricbtion.on('message',(msg : Message)=>{
    console.log('Message recieved');
    const data=msg.getData();

    if(typeof data === 'string'){
      console.log(`Received Event #${msg.getSequence()}, with data: ${data}`)
    }

    msg.ack();
  })

  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName('accounting-service');
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());