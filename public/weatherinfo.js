const appId = '735369837b9f826d6a2e5b7a4bdff16f';
const units = 'metric';
let resultFromServer;

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function getSearchMethod(searchTerm) {
    let searchMethod;

    if (searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
        searchMethod = 'zip';
    else
        searchMethod = 'q';

    return searchMethod;
}
document.addEventListener('DOMContentLoaded', function () {
    // Back Button Event Listener
    var backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function () {
            // Clear the search input when the back button is clicked
            parent.postMessage('clearSearchInput', '*');
            window.history.back();
        });
    }

    // Check if the searchTerm is available before making the API call
    const searchTerm = getQueryParameter('city');
    if (searchTerm) {
        getWeatherDetails(searchTerm);
    } else {
        console.error('No location specified in the query parameter.');
    }
});
function clearSearchInput() {
    // Clear the search input field
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    } else {
        console.error('Search input element not found.');
    }
}

window.addEventListener('message', function (event) {
    if (event.data === 'clearSearchInput') {
        clearSearchInput();
    }
});

// Function to fetch weather details based on search term
function getWeatherDetails(searchTerm) {
    const searchMethod = getSearchMethod(searchTerm);
    // Use 'searchMethod' here directly instead of 'getSearchMethod'
    fetch(`https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`)
        .then((result) => result.json())
        .then((res) => {
            init(res);
        })
        .catch((error) => {
            console.error('Error fetching weather details:', error.message);
            // Handle error and update UI accordingly
        });
}

function init(response) {
    resultFromServer = response;

    switch (resultFromServer.weather[0].main) {
        case 'Clear':
            document.body.style.backgroundImage = "url('/img/clearPicture.jpg')";
            break;

        case 'Clouds':
            document.body.style.backgroundImage = "url('/img/cloudyPicture.jpg')";
            break;

        case 'Rain':
        case 'Drizzle':
            document.body.style.backgroundImage = "url('/img/rainPicture.jpg')";
            break;

        case 'Mist':
            document.body.style.backgroundImage = "url('/img/mistPicture.jpg')";
            break;

        case 'Thunderstorm':
            document.body.style.backgroundImage = "url('/img/stormPicture.jpg')";
            break;

        case 'Snow':
            document.body.style.backgroundImage = "url('/img/snowPicture.jpg')";
            break;

        default:
            break;
    }

    let weatherDescriptionHeader = document.getElementById('weatherDescriptionHeader');
    let temperatureElement = document.getElementById('temperature');
    let humidityElement = document.getElementById('humidity');
    let windSpeedElement = document.getElementById('windSpeed');
    let cityHeader = document.getElementById('cityHeader');

    let weatherIcon = document.getElementById('documentIconImg');
    weatherIcon.src = 'https://openweathermap.org/img/w/' + resultFromServer.weather[0].icon + '.png';

    let resultDescription = resultFromServer.weather[0].description;
    weatherDescriptionHeader.innerText = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);

    // Convert temperature to Celsius
    let temperatureInCelsius = Math.floor(resultFromServer.main.temp);
    temperatureElement.innerHTML = temperatureInCelsius + '&#176;C';

     // Convert wind speed to km/h
     let windSpeedInKmph = Math.floor(resultFromServer.wind.speed * 3.6);
     windSpeedElement.innerHTML = 'Wind Speed: ' + windSpeedInKmph + ' kmph';

    cityHeader.innerHTML = resultFromServer.name;
    humidityElement.innerHTML = 'Humidity levels: ' + resultFromServer.main.humidity +  '%';

    // Get the current time using JavaScript Date object
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Display the current time on the page
    const timeElement = document.getElementById('currentTime');
    timeElement.innerText = `Current Time: ${currentHour}:${currentMinute}`;
   
    let feelsLikeElement = document.getElementById('feelsLike');
    let dayElement = document.getElementById('day');
    let nightElement = document.getElementById('night');
    let eveningElement = document.getElementById('evening');
    let morningElement = document.getElementById('morning');

    feelsLikeElement.innerHTML = 'Feels Like: ' + Math.floor(resultFromServer.main.feels_like) + '&#176;C';
    dayElement.innerHTML = 'Day Temperature: ' + Math.floor(resultFromServer.main.temp_max) + '&#176;C';
    nightElement.innerHTML = 'Night Temperature: ' + Math.floor(resultFromServer.main.temp_min) + '&#176;C';
    eveningElement.innerHTML = 'Evening Temperature: ' + Math.floor(resultFromServer.main.temp) + '&#176;C';
    morningElement.innerHTML = 'Morning Temperature: ' + Math.floor(resultFromServer.main.temp) + '&#176;C';

    setPositionForWeatherInfo();
    
    if (resultFromServer && window.location.href.indexOf('weatherpage.html') === -1) {
        redirectToWeatherPage();
    }
}

function setPositionForWeatherInfo() {
    let weatherContainer = document.getElementById('weatherContainer');
    let weatherContainerHeight = weatherContainer.clientHeight;
    let weatherContainerWidth = weatherContainer.clientWidth;

    weatherContainer.style.left = `calc(50% - ${weatherContainerWidth/2}px)`;
    weatherContainer.style.top = `calc(50% - ${weatherContainerHeight/1.3}px)`;
    weatherContainer.style.visibility = 'visible';
}

function redirectToWeatherPage() {
    if (resultFromServer) {
        const queryParams = `?temperature=${resultFromServer.main.temp}&description=${resultFromServer.weather[0].description}&city=${resultFromServer.name}`;
        window.location.href = 'weatherpage.html' + queryParams;
    }
}
