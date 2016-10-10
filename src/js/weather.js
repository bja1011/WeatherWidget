var weatherWidget = (function () {
    this.run = function () {
        getLocalization();
    };

    var config = {
        units: 'imperial',
        currentWeatherData:null
    };

    var iconsEl;

    loadIcons();

    var cityNameEl = document.getElementById("locationName");
    var forecastEl = document.getElementById("weatherForecast");
    var currentTemp = document.getElementById("currentTemp");
    var currentWindDirectionEl = document.getElementById("currentWindDirection");
    var currentWindSpeedEl = document.getElementById("currentWindSpeed");
    var currentPressureEl = document.getElementById("currentPressure");
    var currentIconEl = document.getElementById("currentIcon");
    var dateEl = document.getElementById("date");
    var locationInputEl = document.getElementById("manualLocation");
    var locationSubmitEl = document.getElementById("submit");
    var manualLocationFormEl = document.getElementById("manualLocationForm");
    var preloaderEl = document.getElementById("preload");
    var unitsEl = document.getElementById("units");

    locationSubmitEl.onclick = function() {
        if(locationInputEl.value != "") {
            getWeather("weather",null,null,function (resp) {
                setCurrentWeather(resp);
            },locationInputEl.value);
            getWeather("forecast/daily",null,null,function (resp) {
                setForecastWeather(resp)
            },locationInputEl.value);
        };
        return false;
    }

    unitsEl.onclick = function () {
        config.units == 'metric'?config.units='imperial':config.units='metric';
        getWeather('weather',config.currentWeatherData.coord.lat,config.currentWeatherData.coord.lon,function (resp) {
            setCurrentWeather(resp);
        });
        getWeather('forecast/daily',config.currentWeatherData.coord.lat,config.currentWeatherData.coord.lon,function (resp) {
            setForecastWeather(resp)
        });
    }

    function getLocalization() {
        if ("geolocation" in navigator) {
            console.log('sdf')
            navigator.geolocation.getCurrentPosition(function(position) {

                getWeather('weather',position.coords.latitude,position.coords.longitude,function (resp) {
                    setCurrentWeather(resp);
                });
                getWeather('forecast/daily',position.coords.latitude,position.coords.longitude,function (resp) {
                    setForecastWeather(resp)
                });
            },function () {
                manualLocationFormEl.style.display = "block";
            });
        } else {
            manualLocationFormEl.style.display = "block";
        }
    }

    function getWeather(type,lat,lng,callback,city) {

        var queryUrl = 'http://api.openweathermap.org/data/2.5/'+type;
        if(city) {
            queryUrl+='?q='+city+'&lang=pl&appid=1929fffb238baf259922bfbb99ae5a73';

        } else {
            queryUrl+='?lat='+lat+'&lang=pl&lon='+lng+'&appid=1929fffb238baf259922bfbb99ae5a73'
        }

        queryUrl+= '&units='+config.units;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', queryUrl);
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
        preloaderEl.style.display = "none";
        manualLocationFormEl.style.display = "none";
        config.currentWeatherData = weatherData;
        dateEl.innerHTML = formatDate(weatherData.dt);
        cityNameEl.innerHTML = weatherData.name;
        currentTemp.innerHTML = formatTemperature(weatherData.main.temp);
        currentIconEl.innerHTML = getIcon(weatherData.weather[0].icon)
        currentPressureEl.innerHTML = formatPressure(weatherData.main.pressure);
        currentWindDirectionEl.style.transform = 'rotate('+weatherData.wind.deg+'deg)';
        currentWindSpeedEl.innerHTML = formatWindSpeed(weatherData.wind.speed);

        unitsEl.innerHTML = config.units == 'metric'?'imperial':'metric';

    }

    function setForecastWeather(weatherData) {
        var forecast = "<ul>";
        weatherData.list.forEach(function (el) {
            var date = new Date(el.dt*1000);
            var day = parseInt(date.getDate());
            forecast+=  "<li><span class='date'>"+day+"</span> <span class='temp'>"+formatTemperature(el.temp.max)+"</span>"+getIcon(el.weather[0].icon)+"</li>";
        });
        forecast+="</ul>";
        forecastEl.innerHTML = forecast;
    }
    
    function formatTemperature(value) {
        var unit = config.units=="metric"?"&#778;C":"&#778;F";
        return Math.round(value)+" "+unit;
    }

    function formatPressure(value) {
        return Math.round(value)+' hPa';
    }

    function formatWindSpeed(value) {
        var unit = config.units=="metric"?"m/s":"m/h";
        return Math.round(value)+" "+unit;

    }

    function formatDate(date) {
        var date = new Date(date*1000);
        var day = parseInt(date.getDate());
        var month = parseInt(date.getMonth());
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        return day+" "+monthNames[month];

    }

    //load icons as html to use animations
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