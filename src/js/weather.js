var weatherWidget = (function () {
    this.run = function () {
        getLocalization();
    };

    var config = {
        units: 'metric'
    };

    var iconsEl;

    loadIcons();


    //preload svg icons as text, to allow svg elements animations
    // var iconsCache = {};
    // preloadIcons();


    var cityNameEl = document.getElementById("locationName");
    var forecastEl = document.getElementById("weatherForecast");
    var currentTemp = document.getElementById("currentTemp");
    var currentIconEl = document.getElementById("currentIcon");

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
                getWeather('forecast/daily',position.coords.latitude,position.coords.longitude,function (resp) {
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
        currentTemp.innerHTML = showTemperature(weatherData.main.temp);
        currentIconEl.innerHTML = getIcon(weatherData.weather[0].icon)

    }

    function setForecastWeather(weatherData) {
        var forecast = "<ul>";
        weatherData.list.forEach(function (el) {
            forecast+=  "<li><span class='date'>"+el.temp.max+"</span>"+getIcon(el.weather[0].icon)+"</li>";
        });
        forecast+="</ul>";
        forecastEl.innerHTML = forecast;
    }
    
    function showTemperature(value) {
        var unit = config.units=="metric"?"&#778;C":"&#778;F";
        return Math.round(value)+" "+unit;
    }

    //load icons and create
    function loadIcons() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'assets/icons/icons.svg');
        xhr.onload = function() {
            if (xhr.status === 200) {
                iconsEl = document.createElement('div');
                iconsEl.innerHTML = xhr.responseText;
            }
            else {
                console.log('Error: ' + xhr.status);
            }
        };
        xhr.send();


    }

    function getIcon(iconId) {
        return iconsEl.querySelectorAll("#icon-"+iconId)[0].outerHTML;
    }



    return {
        run:run
    }

})();

weatherWidget.run();