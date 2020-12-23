import React from 'react';

const ReviewForm = (props) => {
  return (
    <div className="form">
      <form onSubmit={(event) => props.onSubmitHandler(event)}>
        <p>
          Share your review about <strong>{props.attributes.name}</strong>
        </p>
        <div className="form-control">
          <input
            type="text"
            name="title"
            value={props.review.title || ''}
            placeholder="Review Title"
            onChange={(event) => props.onChangeHandler(event)}
          />
        </div>
        <div className="form-control">
          <input
            type="text"
            name="description"
            value={props.review.description || ''}
            placeholder="Review Description"
            onChange={(event) => props.onChangeHandler(event)}
          />
        </div>
        <div className="form-control">
          <div className="rating-container">
            <p className="rating-title-text">Rate This Airline</p>
            [⭐⭐⭐⭐⭐]
          </div>
        </div>
        <button type="submit">Send Your Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;
