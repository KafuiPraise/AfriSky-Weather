document.addEventListener('DOMContentLoaded', function () {
    const locationElement = document.getElementById('location');
    const temperatureElement = document.getElementById('Temperature');
    const descriptionElement = document.getElementById('Description');
    const humidityElement = document.getElementById('Humidity');
    const windSpeedElement = document.getElementById('WindSpeed');
    const timestampElement = document.getElementById('Timestamp');
    const weatherIconElement = document.getElementById('WeatherIcon')
    const weatherContainer = document.querySelector('.weather-container');

    function getYourLocation() {
        // Check if geolocation is supported
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude, timestamp } = position.coords; // Include timestamp

                // Using OpenCage Geocoding API to get location details based on coordinates
                fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=76fa6e1c33974b56bc9300ffe6218c75`)
                    .then(response => response.json())
                    .then(response => {
                        // Extracting relevant details from the OpenCage API response
                        const { city, state, country } = response.results[0].components;
                        console.table(response);

                        // Updating the location element with the detected location
                    if (locationElement) {
                        locationElement.innerText = `${city}, ${state}, ${country}`;
                    } else {
                        console.error('Element with ID "location" not found.');
                    }

                        // Display the timestamp
                        const timestampDate = new Date();
                        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
                        timestampElement.textContent = `${timestampDate.toLocaleString('en-US', options)}`;

                        // Fetching weather information using OpenWeatherMap API
                        const openWeatherApiKey = '735369837b9f826d6a2e5b7a4bdff16f'; // Replace with your OpenWeatherMap API key
                        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&units=metric`)
                            .then(weatherResponse => weatherResponse.json())
                            .then(weatherResponse => {
                                console.table(weatherResponse);
                                // Extracting relevant weather details
                                updateWeatherContainer(weatherResponse);

                                // Redirect to 'location.html' only if it hasn't been redirected before
                                if (!window.location.href.includes('location.html')) {
                                    window.location.href = './location.html';
                                }
                            })
                            .catch(error => {
                                console.error("An error occurred while fetching the weather forecast:", error);
                                alert("An error occurred while fetching the weather forecast!");
                            });
                    })
                    .catch(error => {
                        console.error("An error occurred while fetching location details:", error);
                        alert("An error occurred while fetching location details");
                    });
                    
            });
        }
    }

        

    function updateWeatherContainer(data) {
        switch (data.weather[0].main) {
            case 'Clear':
                document.body.style.backgroundImage = "url('./assets/img/clearPicture.jpg')";
                break;
    
            case 'Clouds':
                document.body.style.backgroundImage = "url('./assets/img/cloudyPicture.jpg')";
                break;
    
            case 'Rain':
            case 'Drizzle':
                document.body.style.backgroundImage = "url('./assets/img/rainPicture.jpg')";
                break;
    
            case 'Mist':
            case 'Haze':
            case 'Fog':    
                document.body.style.backgroundImage = "url('./assets/img/mistPicture.jpg')";
                break;
    
            case 'Thunderstorm':
                document.body.style.backgroundImage = "url('./assets/img/stormPicture.jpg')";
                break;
    
            case 'Snow':
                document.body.style.backgroundImage = "url('./assets/img/snowPicture.jpg')";
                break;
    
            default:
                document.body.style.backgroundImage = "url('./assets/img/the_default-image.jpeg')"
                break;
        }



        // Update the weather container elements with the fetched data
        temperatureElement.textContent = `${Math.floor(data.main.temp)}°C`;
        descriptionElement.textContent = `Description: ${data.weather[0].description}`;
        humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
        windSpeedElement.textContent = `Wind Speed: ${data.wind.speed}m/s`;

        // Weather icon handling
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

        // Display the weather icon
        weatherIconElement.innerHTML = `<img src="${iconUrl}" alt="Weather Icon">`;
        console.log('Weather Icon Element:', weatherIconElement);

        weatherContainer.style.display = 'block';
    }

    getYourLocation();
}); 
