//list all the classes offered at a studio
import { useContext, useEffect, useState, componentDidMount } from "react";
import APIContext from "../../../Contexts/APIContext";
import { Typography } from "@mui/material";
import ClassTable from "./ClassTable";
import Input from "@mui/material/Input";

const ClassScheduleCard = ({ classList, setClassList, setClassSelection }) => {

    const context = useContext(APIContext);
    const studio_number = window.location.href.split("/")[4];
    const [prevURL, setPrevURL] = useState(`http://localhost:8000/classes/${studio_number}/schedule?`);
    const [nextURL, setNextURL] = useState(`http://localhost:8000/classes/${studio_number}/schedule?`);
    const [currURL, setCurrURL] = useState(`http://localhost:8000/classes/${studio_number}/schedule?`);
    const [className, setClassName] = useState("");
    const [coachName, setCoachName] = useState("");
    const [classDate, setClassDate] = useState("");
    const [classDateBefore, setClassDateBefore] = useState("");
    const [classDateAfter, setClassDateAfter] = useState("");
    const [enrolInClass, setEnrolInClass] = useState("");
    const [dropClass, setDropClass] = useState("");
    const [enrolInSession, setEnrolInSession] = useState("");
    const [dropSession, setDropSession] = useState("");

    useEffect(() => {
        fetch(
            currURL + "&" + new URLSearchParams({
                name: className ? className : "",
                coach: coachName ? coachName : "",
                date_before: classDateBefore ? classDateBefore : "",
                date_after: classDateAfter ? classDateAfter : ""
            })
            ,
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
                    setClassList(json.results);
                    setNextURL(json.next);
                    setPrevURL(json.previous);
                }
            })


    }, [currURL, className, coachName, classDate, classDateBefore, classDateAfter])


    const submitEnrollment = () => {
        // path("class/<int:class_id>/enrol/", ClassEnrolView.as_view()),
        const requestOptions = {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
        }
        fetch(
            `http://localhost:8000/classes/class/${enrolInClass}/enrol/`,
            requestOptions
        )
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                alert(json.message)
            })
            .catch((error) => {
                alert(error)
            })
    }

    const submitDropClass = () => {
        // path("class/<int:class_id>/enrol/", ClassEnrolView.as_view()),
        const requestOptions = {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
        }
        fetch(
            `http://localhost:8000/classes/class/${dropClass}/drop/`,
            requestOptions
        )
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                alert(json.message)
            })
            .catch((error) => {
                alert(error)
            })
    }

    const submitEnrolSession = () => {
        // path("class/<int:class_id>/enrol/", ClassEnrolView.as_view()),
        const requestOptions = {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
        }
        fetch(
            `http://localhost:8000/classes/session/${enrolInSession}/enrol/`,
            requestOptions
        )
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                alert(json.message)
            })
            .catch((error) => {
                alert(error)
            })
    }
    const submitDropSession = () => {
        // path("class/<int:class_id>/enrol/", ClassEnrolView.as_view()),
        const requestOptions = {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
        }
        fetch(
            `http://localhost:8000/classes/session/${dropSession}/drop/`,
            requestOptions
        )
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                alert(json.message)
            })
            .catch((error) => {
                alert(error)
            })
    }

    return (
        <>
            <h1>Classes</h1>
            <Typography>Please click a class to see sessions. To sign up for a class or session, please obtain a subscription.</Typography>
            <Typography style={{ display: "inline" }}>Class Name</Typography>
            <Input style={{ width: "10%", height: 20, fontSize: 18, margin: 4, backgroundColor: "#cccccc" }}
                value={className}
                onChange={(event) => {
                    setClassName(event.target.value)
                }}
                label="Class Name"
            />
            <Typography style={{ display: "inline" }}>Coach Name</Typography>
            <Input style={{ width: "10%", height: 20, fontSize: 18, margin: 4, backgroundColor: "#cccccc" }}
                value={coachName}
                onChange={(event) => {
                    setCoachName(event.target.value)
                }}
                label="Coach Name"
            />
            <Typography style={{ display: "inline" }}>Time Range Before (ie. 2022-12-30%208:00)</Typography>
            <Input style={{ width: "10%", height: 20, fontSize: 18, margin: 4, backgroundColor: "#cccccc" }}
                value={classDateBefore}
                onChange={(event) => {
                    setClassDateBefore(event.target.value)
                }}
                label="Class Date Before"
            />
            <Typography style={{ display: "inline" }}>Time Range Date After (ie. 2022-12-30%208:00) </Typography>
            <Input style={{ width: "10%", height: 20, fontSize: 18, margin: 4, backgroundColor: "#cccccc" }}
                value={classDateAfter}
                onChange={(event) => {
                    setClassDateAfter(event.target.value)
                }}
                label="Class Date After"
            />
            <button onClick={() => setCurrURL(prevURL)}>
                {"<"}
            </button>
            <button onClick={() => {
                setCurrURL(nextURL);
            }}>
                {">"}
            </button>
            <ClassTable classList={classList} setClassSelection={setClassSelection} coachList={context.coachList} />
            <>
                <Input style={{ width: "10%", height: 20, fontSize: 18, margin: 4, backgroundColor: "#cccccc" }}
                    value={enrolInClass}
                    onChange={(event) => {
                        setEnrolInClass(event.target.value)
                    }}
                    label="Enrol In Class"
                />
                <button onClick={() => submitEnrollment()}>
                    {"<- Enrol in a class"}
                </button>
                <Input style={{ width: "10%", height: 20, fontSize: 18, margin: 4, backgroundColor: "#cccccc" }}
                    value={dropClass}
                    onChange={(event) => {
                        setDropClass(event.target.value)
                    }}
                    label="Enrol In Class"
                />
                <button onClick={() => submitDropClass()}>
                    {"<- Drop a Class"}
                </button>
                <Input style={{ width: "10%", height: 20, fontSize: 18, margin: 4, backgroundColor: "#cccccc" }}
                    value={enrolInSession}
                    onChange={(event) => {
                        setEnrolInSession(event.target.value)
                    }}
                    label="Enrol In a Class Session"
                />
                <button onClick={() => submitEnrolSession()}>
                    {"<- Enrol In a Class Session"}
                </button>
                <Input style={{ width: "10%", height: 20, fontSize: 18, margin: 4, backgroundColor: "#cccccc" }}
                    value={dropSession}
                    onChange={(event) => {
                        setDropSession(event.target.value)
                    }}
                    label="Drop a Class Session"
                />
                <button onClick={() => submitDropSession()}>
                    {"<- Drop a Class Session"}
                </button>
            </>

        </>
    )
}

export default ClassScheduleCard;