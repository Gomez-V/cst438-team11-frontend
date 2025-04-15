import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {SERVER_URL} from "../../Constants";
import Button from "@mui/material/Button";

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments/sections/{secNo}?studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = (props) => {
  const headers = ['Year', 'Semester', 'CourseId', 'Title', 'Building',
    'Room', 'Times', 'Instructor Name', 'Instructor Email'];

  const [sections, setSections] = useState([]);

  const [message, setMessage] = useState('');

  const STUDENT_ID = 3;

  const fetchSections = async () => {
    try {
      const response = await fetch(
          `${SERVER_URL}/sections/open`);
      if (response.ok) {
        const sections = await response.json();
        setSections(sections);
      } else {
        const json = await response.json();
        setMessage("response error: " + json.message);
      }
    } catch (err) {
      setMessage("network error: "+ err);
    }
  }

  const addSection = async (secNo) => {
    try {
      const response = await fetch(
      `${SERVER_URL}/enrollments/sections/${secNo}?studentId=${STUDENT_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setMessage("Section added");
        fetchSections();
      } else {
        const rc = await response.json();
        setMessage(rc.message);
      }
    } catch (err) {
      setMessage("network error: " + err);
    }
  }

  const onAdd = (s) => {
    const row_idx = s.target.parentNode.parentNode.rowIndex - 1;
    const secNo = sections[row_idx].secNo;
    const title = sections[row_idx].title;
    const times = sections[row_idx].times;
    confirmAlert( {
      title: 'Confirm Add',
      message: `Would you like to add ${title} with date/time: ${times}`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => addSection(secNo)
        },
        {
          label: 'No',
        }
      ]
    });
  }

  useEffect(() => {
    fetchSections();
  }, []);
 
    return(
        <div>
          <h3>List of Courses</h3>
          <h4>{message}</h4>
          <table className="Center" >
            <thead>
            <tr>
              {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
            </tr>
            </thead>
            <tbody>
            {sections.map((s) => (
                <tr key={s.secNo}>
                  <td>{s.year}</td>
                  <td>{s.semester}</td>
                  <td>{s.courseId}</td>
                  <td>{s.title}</td>
                  <td>{s.building}</td>
                  <td>{s.room}</td>
                  <td>{s.times}</td>
                  <td>{s.instructorName}</td>
                  <td>{s.instructorEmail}</td>
                  <td><Button onClick={onAdd}>Add</Button></td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
    );
}

export default CourseEnroll;
