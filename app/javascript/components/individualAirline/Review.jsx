import React from 'react';

const Review = (props) => {
  const { title, description, score } = props.attributes;

  return (
    <div className="review-card">
      <div className="rating-wrapper">
        <div className="rating">{score}</div>
      </div>
      <div className="info">
        <p className="title">{title}</p>
        <p className="description">{description}</p>
      </div>
    </div>
  );
};

export default Review;
