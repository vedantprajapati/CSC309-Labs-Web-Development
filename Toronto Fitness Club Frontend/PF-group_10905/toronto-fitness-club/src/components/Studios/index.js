//note before a user selects a studio, all they can see is the map and the studio list
//when a user selects a studio, they can see the studio details, the class schedule, and the amenities
//this information will be an animated card that slides up from the bottom of the screen? maybe?
import StudioListCard from "./StudioListCard";
import React, { useEffect } from "react";
import { useContext } from "react";
import StudioCard from "./StudioCard";
import APIContext from "../../Contexts/APIContext";

const Studios = () => {
	const context = useContext(APIContext);
	const [locationFlag, setLocationFlag] = React.useState(false);

	useEffect(() => {
		if (navigator.geolocation && !context.location && locationFlag === false) {
			navigator.geolocation.getCurrentPosition((position) => {
				context.setLocation(position.coords.latitude + ", " + position.coords.longitude);
				setLocationFlag(true);
			});
		}
	}, [context.location]);

	return (
		<>
			<StudioListCard />
			{context.studioCard ? <StudioCard /> : <></>}
		</>
	);
};

export default Studios;
