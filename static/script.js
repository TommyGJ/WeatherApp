//used in url to gain JSON data from DarkSky API
var myLatLng;


//initiates map
var map;
var pos;

//array of markers on map
let markers = [];

$(document).ready(function() {


    //Farhenheit and Celsius temps
    var fTemp;
    var cTemp;

    //hold the icon type
    var icon;

    //all attributes that will be filled from API and displayed on page
    var humidity;
    var precipitation;
    var description;
    var windSpeed;
    var iconURL;
    var location;

    //used in 7 day forecast, stores high and low temp as well as icon type
    function Day(low, high, icon){
        this.low = low;
        this.high = high;
        this.icon = icon;
    };




    //Day objects will be pushed to this array
    var forecast = [];

    //stores the url's of each icon
    var background = {    "clear-day": "https://cdn4.iconfinder.com/data/icons/fitness-vol-2/48/65-512.png",
                          "clear-night": "https://cdn1.iconfinder.com/data/icons/weather-18/512/blue_sky_at_night-512.png",
                          "partly-cloudy-day":"https://icons.iconarchive.com/icons/icons8/android/512/Weather-Partly-Cloudy-Day-icon.png",
                          "partly-cloudy-night": "https://icons.iconarchive.com/icons/icons8/android/512/Weather-Partly-Cloudy-Night-icon.png",
                          "cloudy": "https://image.flaticon.com/icons/png/512/51/51728.png",
                          "rain": "https://icons.iconarchive.com/icons/icons8/ios7/256/Weather-Little-Rain-icon.png",
                          "sleet": "https://icons.iconarchive.com/icons/icons8/windows-8/512/Weather-Sleet-icon.png",
                          "snow": "https://d30y9cdsu7xlg0.cloudfront.net/png/64-200.png",
                          "wind": "https://d30y9cdsu7xlg0.cloudfront.net/png/7702-200.png",
                          "fog": "https://cdn4.iconfinder.com/data/icons/wthr/32/659098-cloud-fog-512.png"}




    //if geolocation is found
    if (navigator.geolocation) {

        //gets geolocation to plug into API url
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log(pos.lat);
            console.log(pos.lng);

            //initiates Map with those coordinates
            initMap(pos.lat,pos.lng);

            //center map on pos
            map.setCenter(pos);

            //updates html/weather data for the new location
            reload(pos.lat, pos.lng);

});

function initMap(lat, lon) {

    //creates map on webpage
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {lat: -34.397, lng: 150.644}
    });

    myLatLng = {lat: lat, lng: lon};

    //gets geolocation
    var geocoder = new google.maps.Geocoder();

    //moves map to geolocation that is searched by user
    document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map);

    });


    addMarker(myLatLng, map);

    map.addListener('click', function(event) {
        clear();
        reload(event.latLng.lat(), event.latLng.lng());
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());

        addMarker(event.latLng, map);
        map.setCenter(event.latLng);

        });



}

//adjusts map for the inputted location
function geocodeAddress(geocoder, resultsMap) {

        //gets the searched value
        var address = document.getElementById('address').value;


        //geocodes the searched address
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);


            console.log(results[0].geometry.location.lat());
            console.log(results[0].geometry.location.lng());

            //clears any html text that was present
            clear();

            //updates html for new location
            reload(results[0].geometry.location.lat(), results[0].geometry.location.lng());


            addMarker( results[0].geometry.location, resultsMap);
          }
          else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
function addMarker(location, map){
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);

}

//empties all the html out of the page before it is updated
function clear(){
    $("#location").empty();
    $("#title").empty();
    $("#temp").empty();
    $("#windSpeed").empty();
    $("#description").empty();
    $("#precipitation").empty();
    $("#humidity").empty();
    $("#img").empty();
    $("#forecast").empty();
    $("#address").empty();

    //clears markers
    for (let i = 0; i < markers.length; i++){
        markers[i].setMap(null);
    }

}

//updates html for a new inputted lat and lon
function reload(lat, lon){
     //concat lat and long values into api url
            var url =
                "https://api.darksky.net/forecast/24dad8747ac3e7a30ffcb8daada64f96/" +
                lat +
                "," +
                lon +
                "?callback=?";

            //url for the google location API
            var address_url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyBWtv68ovqDnNP0ht8p_ky9LZ5nVBitHtw";

            //change location text
            $.getJSON(address_url, function(address_data,status) {

                if(address_data.results[3] !== undefined){
                    location = address_data.results[3].formatted_address;
                }
                else if(address_data.results[2] !== undefined){
                    location = address_data.results[2].formatted_address;
                }
                else{
                    location = address_data.results[1].formatted_address;
                }

                $('#location').text(location);

            });

            $.getJSON(url, function(data) {

                //parses JSON and sets values of the key variables
                fTemp = Math.round(data.currently.temperature);
                icon = data.currently.icon;
                description = data.currently.summary;
                windSpeed = data.currently.windSpeed;
                cTemp = Math.round((fTemp - 32) * (5/9));
                humidity = data.currently.humidity * 100;
                precipitation = data.currently.precipProbability * 100;

                //formats current date
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!

                if(dd<10){
                    dd='0'+dd;
                }

                if(mm<10){
                    mm='0'+mm;
                }

                var yyyy = today.getFullYear();

                var today = mm+'/'+dd+'/'+yyyy;

                //updates title for the current date
                $("#title").text("Your Local Weather for " + today);

                //clears forecast array
                forecast = [];

                //fills each day of the 7 day forecast array
                for(var i = 0; i < 7; i++){
                    var forecast_icon = data.daily.data[i+1].icon;
                    var low = Math.round(data.daily.data[i+1].temperatureMin);
                    var high = Math.round(data.daily.data[i+1].temperatureMax);

                    for(var key in background){
                        if(key === forecast_icon){
                        forecast_icon = background[key];
                        }
                    }

                    var new_day = new Day(low, high, forecast_icon);

                    forecast.push(new_day);
                }


                //F -> C toggle functionality
                $('#f').click(function(){
                    $('#f').addClass('btn-primary');
                    $('#c').removeClass('btn-primary');
                    $('#temp').text(fTemp + String.fromCharCode(176));
                });

                $('#c').click(function(){
                    $('#c').addClass('btn-primary');
                    $('#f').removeClass('btn-primary');
                    $('#temp').text(cTemp + String.fromCharCode(176));
                });

                if($('#f').hasClass('btn-primary')){
                    $('#temp').text(fTemp + String.fromCharCode(176));
                }

                else{
                    $('#temp').text(cTemp + String.fromCharCode(176));
                }


                //updates html with the values from JSON
                $('#windSpeed').text('Wind Speed: ' + windSpeed + ' mph' );
                $('#description').text(description);
                $('#humidity').text('Humidity: ' + humidity + "%");
                $('#precipitation').text('Precipitation: ' + precipitation + '%');

                //sets correct skycon
                for(var key in background){
                    if(key === icon){
                        iconURL = background[key];
                    }
                }

                //appends skycon
                $('#img').append("<img src = '" + iconURL + "' class = 'icon'>");

                //sets day of the week for each day in the future forecast
                var d = new Date();
                var weekday = new Array(7);
                d = d.getDay() + 1;
                weekday[0] =  "Sunday";
                weekday[1] = "Monday";
                weekday[2] = "Tuesday";
                weekday[3] = "Wednesday";
                weekday[4] = "Thursday";
                weekday[5] = "Friday";
                weekday[6] = "Saturday";


                //appends each day of the 7 day forecast
                for(var j = 0; j < 7; j++){
                    if(d > 6)
                        d = 0;
                    var n = weekday[d]
                    $('#forecast').append('<div class = "col-sm-1 forecast_box"><p class = "day">' + n + '<img src = ' + forecast[j].icon + ' class = "forecast_icon"><p class = "forecast_text">' + forecast[j].low + '/' + forecast[j].high + '</p></div>');
                    d++;
                }
            });

        }
    }
 });

$(function() {
    $("form").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            $("#submit").click();
            return false;

        }
        else{
            return true;
        }
    });
});



