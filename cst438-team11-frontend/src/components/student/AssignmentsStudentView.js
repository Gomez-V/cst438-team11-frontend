import React, { useState } from 'react';

const AssignmentsStudentView = () => {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const studentId = 3; // Hardcoded for now
  const BACKEND_URL = "http://localhost:8081"; // Gradebook service


  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/assignments?studentId=${studentId}&year=${year}&semester=${semester}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch assignments: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched assignment data:', data);
      setAssignments(data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error fetching assignment data');
      setAssignments([]);
    } finally {
      setSubmitted(true);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (year && semester) {
      setError('');
      fetchAssignments();
    } else {
      setError('Please enter both year and semester.');
    }
  };

  return (
    <div>
      <h3>View My Assignments</h3>

      <form onSubmit={handleSubmit}>
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </label>

        <label style={{ marginLeft: '10px' }}>
          Semester:
          <input
            type="text"
            placeholder="SPRING or FALL"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          />
        </label>

        <button type="submit" style={{ marginLeft: '10px' }}>Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {submitted && assignments.length === 0 && !error && <p>No assignments found.</p>}

      {assignments.length > 0 && (
        <table border="1" cellPadding="10" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Assignment Title</th>
              <th>Due Date</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.assignmentId}>
                <td>{assignment.courseId}</td>
                <td>{assignment.title}</td>
                <td>{assignment.dueDate}</td>
                <td>{assignment.score ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignmentsStudentView;
