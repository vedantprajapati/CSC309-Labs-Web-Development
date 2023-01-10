import { useContext, useEffect } from "react";
import APIContext from "../../../../Contexts/APIContext";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';

const StudioTable = ({ perPage }) => {
    const context = useContext(APIContext);
    const fetchCard = (studio) => {
        fetch(`http://localhost:8000/studios/${studio.id}${context.location? "?" + "location=" + context.location:""}`)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                context.setStudioCard(json);
            })
    }

    
    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th> ID </th>
                    <th> Studio Name </th>
                    <th> Address </th>
                    <th> Latitude/longitude </th>
                    <th> Phone Number </th>
                </tr>
            </thead>
            <tbody>
                {context.studioList.map((studio) => (
                    <tr onClick={() => fetchCard(studio)} key={studio.name}>
                        <td>{studio.id}</td>
                        <td>{studio.name}</td>
                        <td>{studio.address}</td>
                        <td>{studio.latitude + ", " + studio.longitude}</td>
                        <td>{studio.phone_number? studio.phone_number.slice(0,3) +"-"+ studio.phone_number.slice(3,6)+"-"+ studio.phone_number.slice(6,10):""}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default StudioTable;
