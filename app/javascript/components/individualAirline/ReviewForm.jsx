import React from 'react';

const ReviewForm = (props) => {
  const ratingOptions = [1, 2, 3, 4, 5].map((rate, index) => {
    return (
      <input
        key={index}
        type="radio"
        name="rate"
        id={`rate-${rate}`}
        onChange={() => console.log(rate)}
      />
    );
  });

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
            value={props.review.title}
            placeholder="Review Title"
            onChange={(event) => props.onChangeHandler(event)}
          />
        </div>
        <div className="form-control">
          <input
            type="text"
            name="description"
            value={props.review.description}
            placeholder="Review Description"
            onChange={(event) => props.onChangeHandler(event)}
          />
        </div>
        <div className="form-control">
          <div className="rating-container">
            <p className="rating-title-text">Rate This Airline</p>
            {ratingOptions}
            [⭐⭐⭐⭐⭐]
          </div>
        </div>
        <button type="submit">Send Your Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;
