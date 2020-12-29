import React from 'react';
import Rating from '../Rating/Rating';

const Review = (props) => {
  const { title, description, score } = props.attributes;

  return (
    <div className="review-card">
      <div className="rating-wrapper">
        <Rating score={score} />
      </div>
      <div className="info">
        <p className="title">{title}</p>
        <p className="description">{description}</p>
      </div>
    </div>
  );
};

export default Review;
