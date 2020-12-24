import React from 'react';

const ReviewForm = (props) => {
  /** The array is reverse since we make a workaround in the css file
   * to render the hovering and start nicely  */
  const ratingOptions = [5, 4, 3, 2, 1].map((rate, index) => {
    return (
      <React.Fragment key={index}>
        <input
          type="radio"
          name="rate"
          id={`rate-${rate}`}
          onChange={() => console.log(rate)}
        />
        <label></label>
      </React.Fragment>
    );
  });

  return (
    <div className="review-container">
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
              <p className="rating-title">Rate This Airline</p>
              <div className="rating-options">{ratingOptions}</div>
            </div>
          </div>
          <button type="submit">Send Your Review</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
