import React from 'react';
import { NavLink } from 'react-router-dom';

const Airline = ({ attributes }) => {
  return (
    <div className="card">
      <div className="logo">
        <img src={attributes.image_url} alt={attributes.name} />
      </div>
      <div className="description">
        <p className="name">Name: {attributes.name}</p>
        <p className="score">Score: {attributes.average_score}</p>
        <div className="link-wrapper">
          <NavLink to={`/airlines/${attributes.slug}`}>View Airline</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Airline;
