//any reusable utility functions go here

// function to check if user is logged in


function getLocation() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        return "Geolocation is not supported by this browser.";
    }
  }

function showPosition(position) {
    return "Latitude: " + position.coords.latitude +"<br>Longitude: " + position.coords.longitude;
} 

export { getLocation, showPosition };