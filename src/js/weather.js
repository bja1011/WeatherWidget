var weatherWidget = (function () {
    this.run = function () {
        getLocalization();
    };

    var cityNameEl = document.getElementById("locationName");
    var forecastEl = document.getElementById("weatherForecast");
    var currentTemp = document.getElementById("currentTemp");

    var myLocation = {
        lat:null,
        lng:null,
        name:null
    };

    function getLocalization() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                getWeather('weather',position.coords.latitude,position.coords.longitude,function (resp) {
                    setCurrentWeather(resp)
                });
                getWeather('forecast',position.coords.latitude,position.coords.longitude,function (resp) {
                    setForecastWeather(resp)
                });
            });
        } else {
            alert('no geloloc')
        }
    }

    function getWeather(type,lat,lng,callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://api.openweathermap.org/data/2.5/'+type+'?lat='+lat+'&lang=pl&lon='+lng+'&appid=1929fffb238baf259922bfbb99ae5a73&units=metric');
        xhr.onload = function() {
            if (xhr.status === 200) {
                var resp = JSON.parse(xhr.responseText);
                callback(resp);
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }

    function setCurrentWeather(weatherData) {
        cityNameEl.innerHTML = weatherData.name;
        currentTemp.innerHTML = weatherData.main.temp;
    }
    function setForecastWeather(weatherData) {
        var forecast = "<ul>";
        weatherData.list.forEach(function (el) {
            forecast+=  "<li>"+el.main.temp+"</li>";
        });
        forecast+="</ul>";
        forecastEl.innerHTML = forecast;
    }

    return {
        run:run
    }

})();

weatherWidget.run();