import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const GRADEBOOK_URL = "http://localhost:8081"

// complete the code.  
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = (props)  => {

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [assignment, setAssignment] = useState({assignmentId:'0', title:'', dueDate:'', secNo:props.secNo});

    // edit assignment dialog
    const editOpen = () => {
        setOpen(true);
        setEditMessage("Section Number: " + props.secNo);
    };

    const editClose = () => {
        setOpen(false);
        setAssignment({assignmentId:'0', title:'', dueDate:''});
        setEditMessage('');
    };

    const editChange = (event) => {
        setAssignment({...assignment,  [event.target.name]:event.target.value})
    }

    const onSave = async () => {
    if (assignment.title === '') {
      setEditMessage("Title can not be blank");
    } else if (isNaN(Date.parse(assignment.dueDate))) {
      setEditMessage("DueDate must be a valid date");
    } else {
      try {
        const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: assignment.title,
            dueDate: assignment.dueDate,
            secNo: props.secNo,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status} - Could not add assignment`);
        }

        setEditMessage("Assignment added successfully!");
        editClose();

      } catch (error) {
        setEditMessage(`Failed to save assignment: ${error.message}`);
      }
    }
  };

    return (
        <>
            <Button id="addAssignment" onClick={editOpen}>Add Assignment</Button>
            <Dialog open={open} >
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h4>{editMessage}</h4>
                    <TextField style={{padding:10}} fullWidth id="atitle" label="Title" name="title" value={assignment.title} onChange={editChange}  />
                    <TextField style={{padding:10}} fullWidth id="aduedate" label="Due Date" name="dueDate" value={assignment.dueDate} onChange={editChange}  />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" id="asave" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AssignmentAdd;
