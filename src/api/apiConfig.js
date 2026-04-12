const BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : `http://${window.location.hostname}:5000/api`;

export default BASE_URL;
