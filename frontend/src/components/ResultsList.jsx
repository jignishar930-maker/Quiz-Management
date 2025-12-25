import React, { useEffect, useState } from 'react';
import { fetchUserResults } from '../api';

const ResultsList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResults = async () => {
      try {
        const data = await fetchUserResults();
        setResults(data);
      } catch (err) {
        console.error("રિઝલ્ટ લોડ કરવામાં ભૂલ:", err);
      } finally {
        setLoading(false);
      }
    };
    getResults();
  }, []);

  if (loading) return <p>લોડ થઈ રહ્યું છે...</p>;

  return (
    <div className="container mt-4">
      <h2>મારા ક્વિઝ રિઝલ્ટ</h2>
      {results.length === 0 ? (
        <p>તમે હજુ સુધી કોઈ ક્વિઝ આપી નથી.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead className="table-dark">
            <tr>
              <th>ક્વિઝ નામ</th>
              <th>સ્કોર</th>
              <th>ટકાવારી</th>
              <th>તારીખ</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => (
              <tr key={res.id}>
                <td>{res.quiz_title}</td>
                <td>{res.score} / {res.total_questions}</td>
                <td>{res.percentage}%</td>
                <td>{new Date(res.completed_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultsList;