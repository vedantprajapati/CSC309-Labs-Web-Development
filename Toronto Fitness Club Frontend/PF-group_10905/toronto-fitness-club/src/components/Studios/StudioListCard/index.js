import { useContext, useEffect, useState } from "react";
import StudioTable from "./StudioTable";
import APIContext from "../../../Contexts/APIContext";
import { Typography } from "@mui/material";
import Input from '@mui/material/Input';


const StudioListCard = () => {

    const context = useContext(APIContext);
    const [studioName, setStudioName] = useState("");
    const [coachName, setCoachName] = useState("");
    const [className, setClassName] = useState("");
    const [studios, setStudios] = useState([]);

    const [nextURL, setNextURL] = useState("http://localhost:8000/studios/list?");
    const [currURL, setCurrURL] = useState("http://localhost:8000/studios/list?");
    const [prevURL, setPrevURL] = useState("http://localhost:8000/studios/list?");
    useEffect(() => {
        fetch(
            currURL + "&" +
            new URLSearchParams({
                location: context.location ? context.location : "",
                name: studioName ? studioName : "",
                coach: coachName ? coachName : "",
                class_name: className ? className : "",
            }),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }

        )
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                if (json.count !== 0) {
                    context.setStudioList(json.results);
                    setNextURL(json.next);
                    setPrevURL(json.previous);
                }
            })

    }, [currURL, context.location, studioName, coachName, className])

    return (
        <>
            <Typography>Please click a course or search below to see further details</Typography>
            <Typography style={{ display: "inline" }}>Location</Typography>
            <Input
                style={{ width: 300, height: 20, fontSize: 18, margin: 4, backgroundColor:"#cccccc" }}
                value={context.location}
                onChange={(event) => {
                    context.setLocation(event.target.value)
                }}
                label="Location"
            />
            <Typography style={{ display: "inline" }}>Name</Typography>
            <Input
                style={{ width: 300, height: 20, fontSize: 18, margin: 4, backgroundColor:"#cccccc" }}
                value={studioName}
                onChange={(event) => {
                    setStudioName(event.target.value)
                }}
                label="studioName"
            />
            <Typography style={{ display: "inline" }}>Coach</Typography>
            <Input
                style={{ width: 300, height: 20, fontSize: 18, margin: 4, backgroundColor:"#cccccc" }}
                value={coachName}
                onChange={(event) => {
                    setCoachName(event.target.value)
                }}
                label="coachName"
            />
            <Typography style={{ display: "inline" }}>Class Name</Typography>
            <Input
                style={{ width: 300, height: 20, fontSize: 18, margin: 4, backgroundColor:"#cccccc" }}
                value={className}
                onChange={(event) => {
                    setClassName(event.target.value)
                }}
                label="className"
            />
            <button onClick={() => setCurrURL(prevURL)}>
                {"<-"}
            </button>
            <button onClick={() => {
                setCurrURL(nextURL);
            }}>
                {"->"}
            </button>
            <StudioTable />
        </>
    )
}

export default StudioListCard;