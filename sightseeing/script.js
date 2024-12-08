let map;
let service;
let infowindow;
let markers = []; // Array to hold markers

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map = new google.maps.Map(document.getElementById('map'), {
                center: userLocation,
                zoom: 9,
            });
            infowindow = new google.maps.InfoWindow();
            const request = {
                location: userLocation,
                radius: '50000', // Search within 50 km
                keyword: 'sightseeing'
            };
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);
        }, function (error) {
            handleLocationError(true, error.message);
        });
    } else {
        handleLocationError(false, "Error: Your browser doesn't support geolocation.");
    }
}

function findssPoints() {
    const zipCode = document.getElementById('zipCode').value;
    if (zipCode) {
        convertZipToLocation(zipCode, function (location) {
            map.panTo(location); // Navigate to the new location
            map.setZoom(9); // Set the zoom level
            searchtrailPoints(location);
        });
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.panTo(location); // Navigate to the current location
            map.setZoom(9); // Set the zoom level
            searchtrailPoints(location);
        });
    } else {
        handleLocationError(false, "Error: Geolocation is not available.");
    }
}

function convertZipToLocation(zipCode, callback) {
    // Use Google Geocoding API to convert the zip code to a location
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': zipCode }, function (results, status) {
        if (status == 'OK') {
            callback(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function showTrailDetails(placeId) {
    const request = {
        placeId: placeId,
        fields: ['name', 'formatted_address', 'reviews']
    };
    service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayTrailDetails(place);
        }
    });
}

function displayTrailDetails(place) {
    const reviews = place.reviews ? place.reviews.map(review => `<strong>${review.author_name}</strong>: ${review.text}`).join('<br><br>'): 'No reviews available';
    const detailsHTML = `
        <div class="popup" id="SSPopup">
            <div class="popup-content">
                <span class="close" onclick="closePopup()">&times;</span>
                <h3>${place.name}</h3>
                <p>${place.formatted_address}</p>
                <p>Reviews:<br>${reviews}</p>
            </div>
        </div>`;
    // Add blur effect to the background
    document.getElementById('map').classList.add('blur-background'); // Assuming 'map' is the ID of your map container
    // Blur the trails list and button
    document.getElementById('SSList').classList.add('blur-element');
    document.querySelector('button').classList.add('blur-element');
    document.getElementById('popupContainer').innerHTML = detailsHTML;
    document.getElementById('SSPopup').style.display = 'block';
}

function closePopup() {
    document.getElementById('SSPopup').style.display = 'none';

    // Remove blur effect from the background
    document.getElementById('map').classList.remove('blur-background');

    // Remove blur from the trails list and button
    document.getElementById('SSList').classList.remove('blur-element');
    document.querySelector('button').classList.remove('blur-element');
}

function searchtrailPoints(location) {
    clearMarkers(); // Clear existing markers
    const request = {
        location: location,
        radius: '50000', // 50 km radius
        keyword: 'sightseeing'
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function clearMarkers() {
    for (let marker of markers) {
        marker.setMap(null);
    }
    markers = [];
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        const listElement = document.getElementById('SSList');
        listElement.innerHTML = ''; // Clear existing list
        for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);

            // Create a list item with a clickable link to show details
            const listItem = document.createElement('li');
            const link = document.createElement('a'); // Use an <a> tag for the clickable link
            link.href = '#'; // Add a placeholder href, you can update this with the actual link
            link.textContent = results[i].name;
            link.onclick = function () {
                showTrailDetails(results[i].place_id);
                return false; // Prevent the default link behavior
            };
            listItem.appendChild(link);
            listElement.appendChild(listItem);
        }
    } else {
        alert('Search was not successful for the following reason: ' + status);
    }
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    markers.push(marker); // Add new marker to the array
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function handleLocationError(browserHasGeolocation, errorMessage) {
    alert(errorMessage);
}
