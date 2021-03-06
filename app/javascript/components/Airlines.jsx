import React, { useState, useEffect } from 'react';
import Airline from '../components/Airline';
import axios from 'axios';
import airlineService from '../services/airlines';

const Airlines = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    airlines: null,
  });

  useEffect(() => {
    const source = axios.CancelToken.source();
    const cancelToken = source.token;
    setState({
      loading: true,
      error: null,
      airlines: null,
    });

    airlineService
      .getAllAirlines(cancelToken)
      .then((response) => {
        setState({
          loading: false,
          error: null,
          airlines: response.data.data,
        });
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          setState({
            loading: false,
            error: error.message,
            airlines: null,
          });
        }
      });

    return () => source.cancel();
  }, [setState]);

  if (state.loading) {
    return <div>Loading</div>;
  }

  if (state.error) {
    return <div>{error} :(</div>;
  }

  if (!state.airlines && !state.loading) {
    return <div>No Airlines Available</div>;
  }

  return (
    <section className="airlines">
      <div className="header">
        <h1>Airlines Rate</h1>
        <h2>All the airline reviews in just one place</h2>
      </div>
      <div className="grid-content">
        {state.airlines &&
          state.airlines.map((airline) => (
            <Airline
              key={airline.attributes.name}
              attributes={airline.attributes}
            />
          ))}
      </div>
    </section>
  );
};

export default Airlines;
