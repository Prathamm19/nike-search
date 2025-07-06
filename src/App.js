import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.post('http://localhost:8000/search', {
          query,
          top_k: 5
        });
        setSuggestions(res.data.results);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const timer = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProductSelect = async (product) => {
    console.log("🟡 Selected:", product);
    setSuggestions([]);
    setQuery(product.title);
    setLoading(true);
    setSelectedProduct(null);

    try {
      const res = await axios.post('http://localhost:8000/product', {
        product_id: product.id
      });

      setSelectedProduct({
        ...product,
        title: res.data.title,
        subtitle: res.data.subtitle, 
        description: res.data.description
      });
    } catch (err) {
      console.error("❌ API error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Nike Product Search</h1>
      <div className="search-container" ref={searchRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((item) => (
  <li key={item.id} onClick={() => handleProductSelect(item)}>
    {item.title}
  </li>
))}

          </ul>
        )}
      </div>

      {loading && <p>Loading product details...</p>}
      {selectedProduct && (
  <div className="product-display">
    <h2>{selectedProduct.title}</h2>

    {selectedProduct.subtitle && ( // ✅ Only if subtitle exists
      <h3>{selectedProduct.subtitle}</h3>
    )}

    <div className="product-description">
      <h4>Description:</h4>
      <p>{selectedProduct.description}</p>
    </div>
  </div>
)}

    </div>
  );
}

export default App;
