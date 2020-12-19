import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    axios
      .get('/api/v1/airlines/', {
        cancelToken,
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        console.log(response.data.data);
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
    <div>
      {state.airlines && (
        <ul>
          {state.airlines.map((airline) => (
            <li key={airline.attributes.name}>{airline.attributes.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Airlines;
