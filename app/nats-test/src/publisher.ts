import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', 'abc', {             //This is client listening and connects to nats streaming server
  url: 'http://localhost:4222',
});


stan.on('connect', () => {                //This runs only after client(stan) successfully connects to nats streaming server
  console.log('Publisher connected to NATS');  //Instead of async we are using event driven approcach

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});