import React from 'react';

const Rating = (props) => {
  const score = (props.score / 5) * 100;
  return (
    <span className="star-container">
      <span className="stars" style={{ width: score + '%' }}></span>
    </span>
  );
};

export default Rating;
