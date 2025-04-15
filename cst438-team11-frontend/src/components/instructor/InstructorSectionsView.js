import React, {useState, useEffect} from 'react';
import {Link, useLocation, UseLocation} from "react-router-dom";
import {SERVER_URL} from "../../Constants";
import AssignmentGrade from "./AssignmentGrade";
import AssignmentUpdate from "./AssignmentUpdate";
import Button from "@mui/material/Button";
import AssignmentAdd from "./AssignmentAdd";

// instructor views a list of sections they are teaching 
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:  
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = (props) => {
    const location = useLocation();
    const {year, semester} = location.state;

    const headers = ['secNo', 'courseId', 'secId',  'building', 'room', 'times', '', ''];

    const [sections, setSections] = useState([    ]);

    const [ message, setMessage ] = useState('');

    const fetchSections = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections?email=dwisneski@csumb.edu&year=${year}&semester=${semester}`);
            if (response.ok) {
                let sections = await response.json();
                // sections = sections.map(a => ({...a, assignmentId: a.id, secNo: secNo}))
                setSections(sections);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    useEffect( () => {
        fetchSections();
    },  []);

    return(
        <div>
            <h3>Sections for {semester} {year}</h3>
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
                        <td>{s.secNo}</td>
                        <td>{s.courseId}</td>
                        <td>{s.secId}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td><Link id={"e"+s.secNo} to="/enrollments" state={s}>View Enrollments</Link></td>
                        <td><Link id={"a"+s.secNo} to="/assignments" state={s}>View Assignments</Link></td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/*<AssignmentAdd secNo={secNo} save={addAssignment} />*/}
        </div>
    );
}

export default InstructorSectionsView;

