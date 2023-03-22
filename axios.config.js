import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiM2ZhYmQ0Ny0yNWU3LTQ0MGQtYTkxYy1kMmZjN2Q1YjA0NmIiLCJpYXQiOjE2Nzk1MTYwOTAsImV4cCI6MTY3OTUxOTY5MH0.zm6usl0HELbEFz_pMRX3R_l0cNw0Y3FQs2i9WCldaU4";

axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.headers.common = {'Authorization': `bearer ${token}`}

export default axios;
