import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";

//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

const AssignmentUpdate = (props)  => {

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [assignment, setAssignment] = useState({assignmentId:'', title:'', dueDate:'', secNo:props.secNo});

    const editOpen = (event) => {
        setOpen(true);
        setEditMessage('');
        setAssignment(props.assignment);
    };

    const editClose = () => {
        setOpen(false);
        setAssignment({courseId:'', title:'', credits:'', secNo:props.secNo});
    };

    const editChange = (event) => {
        setAssignment({...assignment,  [event.target.name]:event.target.value})
    }

    const onSave = () => {
        if (assignment.assignmentId==='') {
            setEditMessage("AssignmentId can not be blank");
        } else if (assignment.title==='') {
            setEditMessage("Title can not be blank");
        } else if ( isNaN(Date.parse(assignment.dueDate))) {
            setEditMessage("DueDate must be a valid date");
        } else {
            setAssignment({...assignment, secNo: 8});
            props.save(assignment);
            editClose();
        }
    }

    return (
        <>
            <Button onClick={editOpen}>Edit</Button>
            <Dialog open={open} >
                <DialogTitle>Edit Assignment</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h4>{editMessage}</h4>
                    <TextField style={{padding:10}} autoFocus fullWidth label="assignmentId" name="assignmentId" value={assignment.assignmentId}  InputProps={{readOnly: true, }}  />
                    <TextField style={{padding:10}} fullWidth label="title" name="title" value={assignment.title} onChange={editChange}  />
                    <TextField style={{padding:10}} fullWidth label="dueDate" name="dueDate" value={assignment.dueDate} onChange={editChange}  />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AssignmentUpdate;
