import { useState, useEffect } from 'react';

import axios from 'axios';

export default function BusinessesLoader() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/businesses')
      .then(response => {
        setBusinesses(response.data); 
      })
      .catch(error => {
        console.error('Failed to fetch businesses:', error);
      })
      .finally(() => setLoading(false));
  }, []);
}