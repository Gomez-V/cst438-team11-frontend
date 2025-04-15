import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

const InstructorHome = () => {

    const [term, setTerm] = useState({year:'', semester:''});
    // const [term, setTerm] = useState({year:'2025', semester:'Spring'}); // for testing

    const onChange = (event) => {
    setTerm({...term, [event.target.name]:event.target.value});
    }

    useEffect( () => {
    },  []);

    return (
        <>
            <table className="Center">
            <tbody>
            <tr>
                <td>Year:</td>
                <td><input type="text" id="year" name="year" value={term.year} onChange={onChange} /></td>
            </tr>
            <tr>
                <td>Semester:</td>
                <td><input type="text" id="semester" name="semester" value={term.semester} onChange={onChange} /></td>
            </tr>
            </tbody>
            </table>
            <Link to='/sections' id="isectionlink" state={term}>Show Sections</Link>
        </>
    )
};

export default InstructorHome;
