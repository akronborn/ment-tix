import Link from 'next/link';

const LandingPage = ({ activeUser, tix }) => {
  const showTix = tix.map((tix) => {
    return (
      <tr key={tix.id}>
        <td>{tix.title}</td>
        <td>{tix.content}</td>
        <td>{tix.price}</td>
        <td>
          <Link href="/tix/[tixId]" as={`/tix/${tix.id}`}>
            <a>View Tix</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tix</h1>
      <table className="table">
        <thead>
          <th>Title</th>
          <th>Content</th>
          <th>Price</th>
          <th>Link</th>
        </thead>
        <tbody>{showTix}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, activeUser) => {
  const { data } = await client.get('/api/tix');

  return { tix: data };
};

export default LandingPage;
