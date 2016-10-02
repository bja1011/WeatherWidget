var weatherWidget = (function () {
    this.run = function () {
        getLocalization();
    };

    var cityNameEl = document.getElementById("cityName");
    var forecastEl = document.getElementById("weatherForecast");

    var myLocation = {
        lat:null,
        lng:null,
        name:null
    };

    function getLocalization() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position);
                getWeather('weather',position.coords.latitude,position.coords.longitude);
                getWeather('forecast',position.coords.latitude,position.coords.longitude);
            });
        } else {
            alert('no geloloc')
        }
    }

    function getWeather(type,lat,lng) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://api.openweathermap.org/data/2.5/'+type+'?lat='+lat+'&lang=pl&lon='+lng+'&appid=1929fffb238baf259922bfbb99ae5a73');
        xhr.onload = function() {
            if (xhr.status === 200) {
                var resp = JSON.parse(xhr.responseText);
                console.log(resp);

                cityNameEl.innerHTML = resp.name;
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }

    return {
        run:run
    }

})();

weatherWidget.run();