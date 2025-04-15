import React, {useEffect, useState} from 'react';
import Button from "@mui/material/Button";
import {SERVER_URL} from "../../Constants";
import {semesters} from "../../Constants";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {ToggleButton, ToggleButtonGroup} from "@mui/material";

// student can view schedule of sections 
// use the URL /enrollments?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollments/{enrollmentId}

const ScheduleView = (props) => {
  const headers = ['Course Title', 'Building', 'Room', 'Course Day & Time', 'Building', 'Semester', '']

  const [enrollments, setEnrollments] = useState([]);

  const [message, setMessage] = useState('');

  const STUDENT_ID = 3;
  const YEAR = ['2024', '2025'];
  const [selectedYear, setYear] = useState('2024');


  useEffect(() => {
    getEnrollments(selectedYear);
  }, [selectedYear]);

  //const soft = array.filter(({ categories }) =>
  //    categories.some(({ name }) => name === 'soft')

  //console.log('enrollments: ' + enrollments);

  const onSelect = async (e, year) => {
    if(year != null) {
      await setYear(year);
      await getEnrollments(year);
    }
    //const col_idx = y.target.parentNode.colIndex - 1;
    //const year = YEAR[col_idx];
  }

  const getEnrollments = async (year) => {
    let enrollments_array = [];
    for (const [, semester] of semesters.entries()) {
      try {
        const response = await fetch(
            `${SERVER_URL}/enrollments?studentId=${STUDENT_ID}&year=${year}&semester=${semester}`);
        if (response.ok) {
          const enrollments = await response.json();
          for (const [, enrollment] of enrollments.entries()) {
            enrollments_array.push(enrollment);
          }
        } else {
          const json = await response.json();
          setMessage("response error: " + json.message);
        }
      } catch (err) {
        setMessage("network error: " + err);
      }
    }
    setEnrollments(enrollments_array);
  }

  const dropEnrollment = async (enrollmentId) => {
    try {
      const response = await fetch(
          `${SERVER_URL}/enrollments/${enrollmentId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      if (response.ok) {
        setMessage("Class dropped");
        getEnrollments(selectedYear);
      } else {
        const rc = await response.json();
        setMessage(rc.message);
      }
    } catch (err) {
      setMessage("network error: " + err);
    }
  }

  const onDrop = (e) => {
    const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
    const enrollmentId = enrollments[row_idx].enrollmentId;
    const title = enrollments[row_idx].title;
    const times = enrollments[row_idx].times;
    confirmAlert( {
      title: 'Confirm Drop',
      message: `Would you like to drop ${title} with date/time: ${times}`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => dropEnrollment(enrollmentId)
        },
        {
          label: 'No',
        }
      ]
    });
  }

  /*
  return(
      <div>
        <h3>Course Schedule</h3>
        <h4>{message}</h4>
          {YEAR.map((y, idx) => (<div><h4 key={idx}>{y}</h4>
          {semesters.map((s, idx) => (<div><h4 key={idx}>{s}</h4>
            <table className="Center">
              <thead>
              <tr>
                {headers.map((h, idx) => (<th key={idx}>{h}</th>))}
              </tr>
              </thead>
              <tbody>
              {enrollments.filter(e => e.year === parseInt(y) && e.semester === s).map(e => (
                  <tr key={e.enrollmentId}>
                    <td>{e.title}</td>
                    <td>{e.building}</td>
                    <td>{e.room}</td>
                    <td>{e.times}</td>
                    <td>{e.credits}</td>
                    <td>{e.semester}</td>
                    <td><Button onClick={onDrop}>Drop</Button></td>
                  </tr>
              ))}
            </tbody>
          </table>
          </div>))}
          </div>))}
      </div>
  ); */



  return(
      <>
        <h3>Course Schedule</h3>
        <h4>{message}</h4>
        <table className="Center">
          <tbody>
          <tr>
            <ToggleButtonGroup
              color="primary"
              value={selectedYear}
              exclusive
              onChange={onSelect}
            >
            {YEAR.map((y, idx) =>
                (<td key={idx}>
                  <h2>
                    <ToggleButton value={y}>{y}</ToggleButton>
                  </h2>
                </td>))}
            </ToggleButtonGroup>
          </tr>
          </tbody>
        </table>
        <table className="Center">
          <thead>
          <tr>
            {headers.map((h, idx) => (<th key={idx}>{h}</th>))}
          </tr>
          </thead>
          <tbody>
          {enrollments.map(e => (
              <tr key={e.enrollmentId}>
                <td>{e.title}</td>
                <td>{e.building}</td>
                <td>{e.room}</td>
                <td>{e.times}</td>
                <td>{e.credits}</td>
                <td>{e.semester}</td>
                <td>{e.year}</td>
                <td><Button onClick={onDrop}>Drop</Button></td>
              </tr>
          ))}
          </tbody>
        </table>
      </>
  );

}

export default ScheduleView;
