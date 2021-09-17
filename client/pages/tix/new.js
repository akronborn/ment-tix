import { useState } from 'react';
import useRequest from '../.././hooks/use-request';
import Router from 'next/router';

const NewTix = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const { makeRequest, errors } = useRequest({
    url: '/api/tix',
    method: 'post',
    body: {
      title,
      content,
      price,
    },
    // change to /tix/:tixId
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    makeRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create Tix</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={'Ex: Sr. Developer Q&A for Jr. Developers'}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={'Provide a description and availability'}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={'Price must be a number, no symbols'}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTix;
