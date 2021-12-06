import {Ticket} from '../Ticket';

it('This implements concurrency control',async ()=>{

  const ticket=Ticket.build({
    title : 'Jagannath event',
    price : 15,
    userId : '123'
  });

  await ticket.save();

  const firstInstance=await Ticket.findById(ticket.id);
  const secondInstance=await Ticket.findById(ticket.id);

  firstInstance!.set({price : 10});
  secondInstance!.set({price : 20});

  await firstInstance!.save();
  //this should throw an error as after saving firstInstance version will
  //be 1 but secondInstance saves only when version is 0
  // expect(async ()=>{
  //   await secondInstance!.save();
  // }).toThrow();

  try{
    await secondInstance!.save();
  }
  catch(err){
    return ;
  }

  throw new Error('Something is wrong with concurrancy,it should not reach this point');
});

it('Mongoose should Increment the version on multiple saves',async ()=>{

  const ticket=Ticket.build({
    title : 'Jagannath event',
    price : 15,
    userId : '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
  await ticket.save();
  await ticket.save();
  expect(ticket.version).toEqual(4);
});