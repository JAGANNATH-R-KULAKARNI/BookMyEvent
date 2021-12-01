import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/Order';
import { Ticket } from '../../models/Ticket';
import {fakeSignin} from '../../test/setup';
import {natsWrapper} from '../../natsWrapper';

it('It should mark an order as cancelled', async () => {
  const ticket = Ticket.build({
    title: 'jagannath',
    price: 20,
  });

  await ticket.save();
 const user= fakeSignin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('It should emit a order cancelled event',async ()=>{

  const ticket = Ticket.build({
    title: 'jagannath',
    price: 20,
  });

  await ticket.save();
 const user= fakeSignin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});