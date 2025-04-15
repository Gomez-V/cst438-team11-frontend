import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {SERVER_URL} from '../../Constants';

// students gets a list of all courses taken and grades
// use the URL /transcripts?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
    const headers = ['Year', 'Semester', 'CourseId', 'SectionId', 'Title', 'Credits', 'Grade'];

    const [enrollments, setEnrollments] = useState([    ]);

    const [message, setMessage] = useState('');

    const STUDENT_ID = 3;

    const fetchTranscript = async () => {
        try {
            const response = await fetch(
                `${SERVER_URL}/transcripts?studentId=${STUDENT_ID}`);
            //console.log(`${SERVER_URL}/transcripts?studentId=${STUDENT_ID}`);
            if (response.ok) {
                const enrollments = await response.json();
                setEnrollments(enrollments);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: "+ err);
        }

    }

    useEffect(() => {
        fetchTranscript();
    }, []);

    return(
        <div>
            <h3>Transcript</h3>
            <h4>{message}</h4>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                    {enrollments.map((e) => (
                        <tr key={e.courseId}>
                            <td>{e.year}</td>
                            <td>{e.semester}</td>
                            <td>{e.courseId}</td>
                            <td>{e.secId}</td>
                            <td>{e.title}</td>
                            <td>{e.credits}</td>
                            <td>{e.grade}</td>
                        </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default Transcript;
