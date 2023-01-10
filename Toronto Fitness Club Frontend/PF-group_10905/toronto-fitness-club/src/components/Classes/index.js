//visualize all the available classes offered at a studio
//list the class schedule (be able to view all sessions offered)
//list the class details when a user clicks a class
//be able to enrol in a class  (add to cart)
//be able to update the sessions inrolled for a course (add, delete, update)

import { useContext, useEffect, useState, componentDidMount } from "react";
import ClassScheduleCard from "./ClassScheduleCard";
import ClassSessionCard from "./ClassSessionCard";

const Classes = () => {
    const [classList, setClassList] = useState([]);
    const [classSelection, setClassSelection] = useState();

    return (
        <>
            <div style={{ height: "50%" }}>
                <ClassScheduleCard classList={classList} setClassList={setClassList} setClassSelection={setClassSelection} />
            </div>
            <div style={{ height: "50%" }}>
                <ClassSessionCard classList={classList} classSelection={classSelection} />
            </div>

        </>
    )
}

export default Classes;