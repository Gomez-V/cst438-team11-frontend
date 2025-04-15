import React, {useEffect, useState} from 'react';
import {SERVER_URL} from "../../Constants";
import {useLocation} from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import AssignmentUpdate from "./AssignmentUpdate";

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignments/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />
const AssignmentGrade = (props) => {

    // const location = useLocation();
    const {assignmentId, title, dueDate} = props.assignment;

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [grade, setGrade] = useState({gradeId:'', studentName:'', studentEmail:'', score:''});
    const [grades, setGrades] = useState([    ]);
    const [ message, setMessage ] = useState('');
    const headers = ['gradeId', 'studentName', 'studentEmail', 'score'];

    const fetchGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${assignmentId}/grades`);
            if (response.ok) {
                let grades = await response.json();
                setGrades(grades);
            } else {
                const json = await response.json();
                setEditMessage("response error: "+json.message);
            }
        } catch (err) {
            setEditMessage("network error: "+err);
        }
    }

    const editOpen = (event) => {
        setOpen(true);
        setEditMessage('');
        fetchGrades();
    };

    const editClose = () => {
        setOpen(false);
        setGrades([]);
    };

    const handleScoreChange = (e, index) => {
        const { value } = e.target;
        const numericValue = Math.max(0, Math.min(100, parseFloat(value) || 0));
        setGrades(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                score: numericValue,
            };
            return updated;
        });
    };

    const saveGrades = async () => {
        setMessage('');
        try {
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grades),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save assignment grades');
            }

            const result = await response.text();
            setEditMessage(result || 'Grades saved successfully!');
        } catch (error) {
            setEditMessage(error.message);
        }
    };

    return(
        <>
            <Button onClick={editOpen} id={props.buttonId}>Grade</Button>
            <Dialog open={open} >
                <DialogTitle>Edit Grades</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h3>Assignment Grades (0-100)</h3>
                    <h4 id={"gmessage"}>{editMessage}</h4>
                    <table>
                        <thead>
                        <tr>
                            <th>Grade ID</th>
                            <th>Student Name</th>
                            <th>Student Email</th>
                            <th>Score (0–100)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {grades.map((g, index) => (
                            <tr key={g.gradeId}>
                                <td>{g.gradeId}</td>
                                <td>{g.studentName}</td>
                                <td>{g.studentEmail}</td>
                                <td>
                                    <input
                                        id={"s"+index}
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={g.score || ''}
                                        onChange={(e) => handleScoreChange(e, index)}
                                        style={{ width: '60px' }
                                        }
                                        
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <center><Button id={"saveGrades"} onClick={saveGrades}>Save Grades</Button></center>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    {/*<Button color="primary" onClick={onSave}>Save</Button>*/}
                </DialogActions>
            </Dialog>
        </>          
    );
}

export default AssignmentGrade;
