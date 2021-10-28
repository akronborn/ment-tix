import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const getOneTix = ({ tix }) => {
  const { makeRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      tixId: tix.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{tix.title}</h1>
      <h4>Details: {tix.content} </h4>
      <h4>Price: {tix.price} </h4>
      {errors}
      <button
        onClick={() => makeRequest()}
        className="btn btn-lg btn-primary"
        type="submit">
        Purchase
      </button>
    </div>
  );
};

getOneTix.getInitialProps = async (context, client) => {
  const { tixId } = context.query;
  const { data } = await client.get(`/api/tix/${tixId}`);

  return { tix: data };
};

export default getOneTix;
