import {createContext, useState} from "react";

export const useAPIContext = () => {
    const [authToken, setAuthToken] = useState("");
    const [studioList, setStudioList] = useState([]);
	const [location, setLocation] = useState("");
    const [studioCard, setStudioCard] = useState({});
    const [subscriptionId, setSubscriptionId] = useState(0);
    const [coachList, setCoachList] = useState([]);

    return {
        studioList,
        setStudioList,
        location,
        setLocation,
        studioCard,
        setStudioCard,
        setAuthToken,
        authToken,
        subscriptionId,
        setSubscriptionId,
        coachList,
        setCoachList,
    }
}

const APIContext = createContext({
    authToken: "",
    studioList: [],
    studioCard: {},
    location: "",
    subscriptionId: 0,
    coachList: [],
})

export default APIContext;