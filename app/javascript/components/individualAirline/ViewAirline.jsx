import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AirlinesHeader from './AirlinesHeader';
import Review from './Review';
import ReviewForm from './ReviewForm';
import airlineService from '../../services/reviews';

const reviewInitialState = {
  title: '',
  description: '',
  airline_id: '',
  score: 0,
};

const initialState = {
  loading: false,
  error: null,
  airline: null,
};

const ViewAirline = (props) => {
  const [state, setState] = useState(initialState);
  const [review, setReview] = useState(reviewInitialState);

  const setRating = (rate) => {
    setReview({ ...review, score: rate });
  };

  const onChangeHandler = ({ target }) => {
    setReview({ ...review, [target.name]: target.value });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const airline_id = state.airline.data.id;

    airlineService
      .createBlog({ review, airline_id })
      .then((response) => {
        const included = [...state.airline.included, response.data];
        setState({ ...state, included });
        setReview(reviewInitialState);
      })
      .catch((error) => setState({ ...state, error: error.message }));
  };

  useEffect(() => {
    const slug = props.match.params.slug;
    const url = `/api/v1/airlines/${slug}`;
    // Axios Cancel Token settings
    const source = axios.CancelToken.source();
    const cancelToken = source.token;

    setState({
      loading: true,
      error: null,
      airline: null,
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
          airline: data,
        });
      })
      .catch(({ message }) => {
        if (axios.isCancel(message)) {
          setState({
            loading: false,
            error: message,
            airline: null,
          });
        }
      });

    return () => source.cancel;
  }, [setState]);

  return (
    <div className="view-info-container">
      {state.error && <div>{state.error}</div>}
      {state.loading && <div>{state.loading}</div>}
      {state.airline && (
        <React.Fragment>
          <div className="column right-column">
            <AirlinesHeader
              attributes={state.airline.data.attributes}
              reviews={state.airline.included}
            />
            {state.airline.included.map((review, index) => (
              <Review key={index} attributes={review.attributes} />
            ))}
          </div>

          <div className="column left-column">
            <ReviewForm
              attributes={state.airline.data.attributes}
              review={review}
              onChangeHandler={onChangeHandler}
              onSubmitHandler={onSubmitHandler}
              setRating={setRating}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default ViewAirline;
