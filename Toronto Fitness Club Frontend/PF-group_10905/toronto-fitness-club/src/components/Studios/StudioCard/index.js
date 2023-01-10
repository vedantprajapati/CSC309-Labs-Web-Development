//display a studio and what is offered at the studio
import { useContext, useEffect, useState } from "react";
import APIContext from "../../../Contexts/APIContext";
import { Button, Card, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

const StudioCard = () => {

    const context = useContext(APIContext);
    const [studio, setStudio] = useState({});
    const [directions, setDirections] = useState("");

    const amenity_types = {
        "PL": "Pool",
        "HK": "Hockey Arena",
        "FIT": "Fitness Centre",
        "GYM": "Gym",
        "SQC": "Squash Court"
    }

    useEffect(() => {
        setStudio(context.studioCard.studio);
        setDirections(context.studioCard.directions);
    }, [context.studioCard]);

    return (
        <>
            {studio &&
                <div>
                    <Card>
                        <Card.Body>
                            <Stack
                                direction="horizontal"
                                className="justify-content-between mb-3"
                            >
                                {studio.images && studio.images.map((item) => (
                                    <img src={`http://localhost:8000/${item.image}`} width="100" height="100" alt="studio" />
                                ))}
                            </Stack>
                            <Card.Title>{studio.name}</Card.Title>
                            {studio.amenities && studio.amenities.map((item) => (
                                <Card.Text>{amenity_types[item.amenity_type]}, Quantity: {item.quantity}</Card.Text>
                            ))}
                            <Button style={{"margin":"10px"}}variant="primary"><a style={{color: "white" }} href={directions}>Get Directions!</a></Button>
                            <Button variant="primary"><Link style={{ color: "white" }} to={`/studios/${studio.id}/schedule`}>View Classes</Link></Button>
                        </Card.Body>
                    </Card>
                </div>
            }

        </>
    );
}
export default StudioCard;