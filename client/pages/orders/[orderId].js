import { useEffect, useState } from 'react';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const getOneOrder = ({ order, activeUser }) => {
  const [secsLeft, setSecsLeft] = useState(0);
  const { makeRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const calcSecsLeft = () => {
      const msTimer = new Date(order.expiresAt) - new Date();
      setSecsLeft(Math.round(msTimer / 1000));
    };

    calcSecsLeft();
    const timerId = setInterval(calcSecsLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (secsLeft < 0) {
    return <div> Order Expired </div>;
  }

  return (
    <div>
      {secsLeft} seconds left to complete order
      <StripeCheckout
        token={({ id }) => makeRequest({ token: id })}
        stripeKey="pk_test_51JT92uLsW2v3AuGw0CNhllSy9so0h46j9p0CtFEx7EPYDtlt3fbQxR70SGDqEf9ZKhxpRBAb5QVW6DQu6PziNcN1006zQXS9ie"
        amount={order.tix.price * 100}
        email={activeUser.email}
      />
      {errors}
    </div>
  );
};

getOneOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default getOneOrder;
