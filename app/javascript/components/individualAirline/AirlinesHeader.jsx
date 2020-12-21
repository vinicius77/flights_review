import React from 'react';

const AirlinesHeader = ({ attributes, reviews }) => {
  const { name, image_url, average_score } = attributes;
  const totalReviews = reviews.length;

  return (
    <div className="container">
      <h1>{name}</h1>
      <img src={image_url} alt={name} />
      <p>{totalReviews} Reviews</p>
      <p>Score {average_score} out of 5</p>
    </div>
  );
};

export default AirlinesHeader;
