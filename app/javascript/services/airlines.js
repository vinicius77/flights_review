import axios from 'axios';
const baseURL = '/api/v1/airlines';

/** GET /api/v1/airlines (All Airlines)*/
const getAllAirlines = (cancelToken) => {
  const request = axios.get(baseURL, {
    cancelToken,
    headers: { 'Content-Type': 'application/json' },
  });

  return request.then((response) => response);
};

export default { getAllAirlines };
