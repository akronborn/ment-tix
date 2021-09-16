const NewTix = () => {
  return (
    <div>
      <h1>Create Tix</h1>
      <form>
        <div className="form-group">
          <label>Title</label>
          <input
            placeholder={'Ex: Sr. Developer Q&A for Jr. Developers'}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <input
            placeholder={'Provide a description and availability'}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            placeholder={'Price must be a number, no symbols'}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTix;
