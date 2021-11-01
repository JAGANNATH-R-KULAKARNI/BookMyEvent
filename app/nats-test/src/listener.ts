import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();//clears the console

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  const subsricbtion=stan.subscribe('ticket:created');

  subsricbtion.on('message',(msg : Message)=>{
    console.log('Message recieved');
    const data=msg.getData();

    if(typeof data === 'string'){
      console.log(`Received Event #${msg.getSequence()}, with data: ${data}`)
    }
  })
  // stan.on('close', () => {
  //   console.log('NATS connection closed!');
  //   process.exit();
  // });

  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName('accounting-service');

  // const subscription = stan.subscribe(
  //   'ticket:created',
  //   'queue-group-name',
  //   options
  // );
});