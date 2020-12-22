import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AirlinesHeader from './AirlinesHeader';

const ViewAirline = (props) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
  });

  useEffect(() => {
    const slug = props.match.params.slug;
    const url = `/api/v1/airlines/${slug}`;
    // Axios Cancel Token settings
    const source = axios.CancelToken.source();
    const cancelToken = source.token;

    setState({
      loading: true,
      error: null,
      data: null,
    });

    axios
      .get(url, {
        headers: { 'Content-type': 'application/json' },
        cancelToken,
      })
      .then(({ data }) => {
        setState({
          loading: false,
          error: null,
          data,
        });
      })
      .catch(({ message }) => {
        if (axios.isCancel(message)) {
          setState({
            loading: false,
            error: message,
            data: null,
          });
        }
      });

    return () => source.cancel;
  }, [setState]);

  return (
    <div className="view-info-container">
      {state.error && <div>{state.error}</div>}
      {state.loading && <div>{state.loading}</div>}
      <div className="column right-column">
        {state.data && (
          <AirlinesHeader
            attributes={state.data.data.attributes}
            reviews={state.data.included}
          />
        )}
        <div className="reviews"></div>
      </div>
      <div className="column left-column">
        <div className="review-form">FORM</div>
      </div>
    </div>
  );
};

export default ViewAirline;
