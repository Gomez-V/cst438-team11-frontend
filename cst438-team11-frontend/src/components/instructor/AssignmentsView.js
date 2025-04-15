import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';
import AssignmentUpdate from "../instructor/AssignmentUpdate";
import AssignmentAdd from "../instructor/AssignmentAdd";
import AssignmentGrade from "./AssignmentGrade";

// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = (props) => {

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;

    const headers = ['AssignmentId', 'Title', 'DueDate',  '', ''];

    const [assignments, setAssignments] = useState([    ]);

    const [ message, setMessage ] = useState('');

    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
            if (response.ok) {
                let assignments = await response.json();
                assignments = assignments.map(a => ({...a, assignmentId: a.id, secNo: secNo}))
                setAssignments(assignments);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    useEffect( () => {
        fetchAssignments();
    },  []);

    const saveAssignment = async (assignment) => {
        try {
            const response = await fetch (`${SERVER_URL}/assignments`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(assignment),
                });
            if (response.ok) {
                setMessage("assignment saved")
                fetchAssignments();
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const addAssignment = async (assignment) => {
        try {
            assignment.secNo = secNo;
            const response = await fetch (`${SERVER_URL}/assignments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(assignment),
                });
            if (response.ok) {
                setMessage("assignment added")
                fetchAssignments();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const deleteAssignment = async (assignmentId) => {
        try {
            const response = await fetch (`${SERVER_URL}/assignments/${assignmentId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            if (response.ok) {
                setMessage("Assignment deleted");
                fetchAssignments();
            } else {
                const rc = await response.json();
                setMessage("Delete failed "+rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const onDelete = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const assignmentId = assignments[row_idx].assignmentId;
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteAssignment(assignmentId)
                },
                {
                    label: 'No',
                }
            ]
        });
    }
     
    return(
        <div>
            <h3>{courseId}-{secId} Assignments</h3>
            <h4 id={"amessage"}>{message}</h4>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {assignments.map((a, index) => (
                    <tr key={a.assignmentId}>
                        <td>{a.assignmentId}</td>
                        <td>{a.title}</td>
                        <td>{a.dueDate}</td>
                        <td><AssignmentGrade buttonId={"g"+index} assignment={a} /></td>
                        <td><AssignmentUpdate assignment={a} save={saveAssignment} /></td>
                        <td><Button onClick={onDelete}>Delete</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <AssignmentAdd secNo={secNo} id="addassignment" save={addAssignment} />
        </div>
    );
}

export default AssignmentsView;
