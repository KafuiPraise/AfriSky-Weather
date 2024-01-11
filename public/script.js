window.appId = '735369837b9f826d6a2e5b7a4bdff16f';
window.units = 'metric';
let searchMethod; // q means searching as a string.

    document.getElementById('goButton').addEventListener('click', () => {
        let searchTerm = document.getElementById('searchInput').value;
        if (searchTerm)
            searchWeather(searchTerm);
    });

    document.getElementById('searchInput').addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            let searchTerm = this.value;
            if (searchTerm) {
                searchWeather(searchTerm);
            }
        }
    });

    function getSearchMethod(searchTerm) {
        if (searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
            searchMethod = 'zip';
        else
            searchMethod = 'q';
            return searchMethod;
    }

    function searchWeather(searchTerm) {
        getSearchMethod(searchTerm);
        fetch(`https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`)
            .then((result) => result.json())
            .then((res) => {
                const queryParams = `?temperature=${res.main.temp}&description=${res.weather[0].description}&city=${res.name}`;
                window.location.href = 'weatherpage.html' + queryParams;
            })
            .catch((error) => {
                console.error('Error fetching weather details:', error.message);
            });
    }