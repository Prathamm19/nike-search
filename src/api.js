// src/api.js
import axios from 'axios';

export const searchProducts = (query) => {
  return axios.post('http://localhost:8000/search', { query, top_k: 5 });
};

export const getProductSummary = (productId) => {
  return axios.post('http://localhost:8000/ask_llm', { product_id: productId });
};