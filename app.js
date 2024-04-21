$(document).ready(function() {
    $('#searchForm').submit(function(event) {
        event.preventDefault();
        var city = $('#cityInput').val();
        searchCity(city);
    });

    function searchCity(city) {
        var apiKey = 'a89f3c15e1e4a0642ddb73c56dfff6ae';
        var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        $.ajax({
            url: currentWeatherUrl,
            method: 'GET',
            success: function(currentData) {
                displayCurrentWeather(currentData);
                addToSearchHistory(city);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching current weather data:', error);
            }
        });

        $.ajax({
            url: forecastUrl,
            method: 'GET',
            success: function(forecastData) {
                displayForecast(forecastData);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching forecast data:', error);
            }
        });
    }

    function displayCurrentWeather(data) {
        $('.current-weather').html(`
            <h2>Current Weather</h2>
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `);
    }

    function displayForecast(data) {
        var forecast = data.list;
        $('.forecast').html('<h2>5-Day Forecast</h2>');
        for (var i = 0; i < forecast.length; i += 8) {
            var forecastData = forecast[i];
            var date = new Date(forecastData.dt * 1000);
            var formattedDate = date.toDateString();
            var temp = forecastData.main.temp;
            var weatherDescription = forecastData.weather[0].description;
            var iconUrl = `http://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;

            $('.forecast').append(`
                <div class="forecast-item">
                    <p>Date: ${formattedDate}</p>
                    <p>Temperature: ${temp}°C</p>
                    <p>Weather: ${weatherDescription}</p>
                    <img src="${iconUrl}" alt="Weather Icon">
                </div>
            `);
        }
    }

    function addToSearchHistory(city) {
        // Check if the city already exists in the history
        if ($(`.history-item[data-city="${city}"]`).length === 0) {
            $('.search-history').append(`<br><a href="#" class="history-item" data-city="${city}">${city}</a>`);
        }
    }

    $('.search-history').on('click', '.history-item', function(event) {
        event.preventDefault();
        var city = $(this).data('city');
        searchCity(city);
    });
});
