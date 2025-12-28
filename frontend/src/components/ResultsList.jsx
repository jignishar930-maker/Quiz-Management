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
        console.error("Loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    getResults();
  }, []);

  if (loading) return <p>Loading.......</p>;

  return (
    <div className="container mt-4">
      <h2>My quiz result</h2>
      {results.length === 0 ? (
        <p>you not attempt the quiz.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead className="table-dark">
            <tr>
              <th>Quiz Name</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Date</th>
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