import React from 'react';
import { NavLink } from 'react-router-dom';

const Airline = ({ attributes }) => {
  return (
    <div>
      <img src={attributes.image_url} alt={attributes.name} />
      <p>Name: {attributes.name}</p>
      <p>Score: {attributes.average_score}</p>
      <NavLink to={`/airlines/${attributes.slug}`}>View Airline</NavLink>
    </div>
  );
};

export default Airline;
