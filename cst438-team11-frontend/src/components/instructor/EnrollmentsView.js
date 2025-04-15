import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {SERVER_URL} from "../../Constants";
import AssignmentGrade from "./AssignmentGrade";
import AssignmentUpdate from "./AssignmentUpdate";
import Button from "@mui/material/Button";
import AssignmentAdd from "./AssignmentAdd";

// instructor view list of students enrolled in a section 
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = (props) => {

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;

    const headers = ['Enrollment Id', 'Student Id', 'Name',  'Email', 'Grade'];

    const [enrollments, setEnrollments] = useState([    ]);

    const [ message, setMessage ] = useState('');

    const fetchEnrollments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/enrollments`);
            if (response.ok) {
                let enrollments = await response.json();
                // enrollments = enrollments.map(a => ({...a, assignmentId: a.id, secNo: secNo}))
                setEnrollments(enrollments);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    useEffect( () => {
        fetchEnrollments();
    },  []);

    const onGradeChange = (e, index) => {
        const newEnrollments = [...enrollments];
        newEnrollments[index].grade = e.target.value;
        setEnrollments(newEnrollments);
    }

    const onSave = async () => {
        setMessage('');
        try {
            const response = await fetch(`${SERVER_URL}/enrollments`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollments),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save assignment grades');
            }

            const result = await response.text();
            setMessage(result || 'Grades saved successfully!');
        } catch (error) {
            setMessage(error.message);
        }
    }

    return(
        <div>
            <h3>{courseId}-{secId} Enrollments</h3>
            <h4 id={"gmessage"}>{message}</h4>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {enrollments.map((e, index) => (
                    <tr key={e.enrollmentId}>
                        <td>{e.enrollmentId}</td>
                        <td>{e.studentId}</td>
                        <td>{e.name}</td>
                        <td>{e.email}</td>
                        <td><input id={"g"+index} type="text" name="grade" value={e.grade} onChange={(e) => onGradeChange(e, index)} /></td>
                        {/*<td><Button onClick={onDelete}>Delete</Button></td>*/}
                    </tr>
                ))}
                </tbody>
            </table>
            <Button id={"saveGrades"} onClick={onSave}>Save Grades</Button>
        </div>
    );
}

export default EnrollmentsView;
