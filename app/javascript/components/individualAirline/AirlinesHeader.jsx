import React from 'react';

const AirlinesHeader = ({ attributes, reviews }) => {
  const { name, image_url, average_score } = attributes;
  const totalReviews = reviews.length;

  return (
    <div className="header-container">
      <h1>
        <img src={image_url} alt={name} /> {name}
      </h1>

      <p className="total-reviews">{totalReviews} Reviews</p>
      <p className="rating">XXX</p>
      <p className="total-score">Score {average_score} out of 5</p>
    </div>
  );
};

export default AirlinesHeader;
