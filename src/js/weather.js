var weatherWidget = (function () {
    this.run = function () {
        getLocalization();
    };

    var cityNameEl = document.getElementById("cityName");

    var myLocation = {
        lat:null,
        lng:null,
        name:null
    };

    function getLocalization() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position);
                getWeather(position.coords.latitude,position.coords.longitude)
            });
        } else {
            alert('no geloloc')
        }
    }

    function getWeather(lat,lng) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&appid=1929fffb238baf259922bfbb99ae5a73');
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