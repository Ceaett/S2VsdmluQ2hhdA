// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5_a0YuNjHDI7NfMuo90e5N475WeThTFo",
    authDomain: "kmonitoramento-1e504.firebaseapp.com",
    databaseURL: "https://kmonitoramento-1e504-default-rtdb.firebaseio.com",
    projectId: "kmonitoramento-1e504",
    storageBucket: "kmonitoramento-1e504.firebasestorage.app",
    messagingSenderId: "1036253657697",
    appId: "1:1036253657697:web:6077a46bc9b58ae5ac0820",
    measurementId: "G-LNM4FPTNRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize Google Maps
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -23.5505, lng: -46.6333 }, // Default to São Paulo
        zoom: 15,
    });
}

// Function to get the current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const batteryLevel = navigator.getBattery().then(battery => battery.level * 100);
            updateDatabase(lat, lon, batteryLevel);
            updateMap(lat, lon);
            fetchAddress(lat, lon);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Function to update the Firebase database
function updateDatabase(lat, lon, batteryLevel) {
    const locationRef = ref(database, 'location/');
    set(locationRef, {
        latitude: lat,
        longitude: lon,
        battery: batteryLevel
    });
}

// Function to update the map with the user's location
function updateMap(lat, lon) {
    const userLocation = new google.maps.LatLng(lat, lon);
    map.setCenter(userLocation);
    new google.maps.Marker({
        position: userLocation,
        map: map,
    });
}

// Function to fetch address from coordinates
function fetchAddress(lat, lon) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: lat, lng: lon };
    geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results[0]) {
            document.getElementById("address").innerText = results[0].formatted_address;
        } else {
            console.error("Geocoder failed due to: " + status);
        }
    });
}

// Start monitoring location and initialize map
initMap();
getLocation();
