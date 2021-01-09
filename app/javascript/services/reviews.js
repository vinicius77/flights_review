import axios from 'axios';
const baseURL = '/api/v1/reviews';

/** POST /api/v1/reviews */
const createBlog = async ({ review, airline_id }) => {
  /** It's a secret, user-specific token in all form submissions and
   *** side-effect URLs to prevent Cross-Site Request Forgeries. */
  const csrfToken = document.querySelector('[name=csrf-token]').content;
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
  axios.defaults.headers.common.accept = 'application/json';

  const response = await axios.post(baseURL, { review, airline_id });

  return response.data;
};

export default { createBlog };
