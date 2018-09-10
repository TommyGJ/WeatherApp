CS50 Final Project: Weather Web Application

Our initial thoughts for the design of the project were to implement a simple website that used geolocation to show the current weather
and conditions of your location. This simply required html, CSS, and a JQuery call to an API. Once we were able to sucessfully
implement that, we added a 7 day forecast of highs and lows to the bottom the webpage.

This was a good start, but we wanted to add some dynamism to the website. Our first goal in this field was to have a search bar at
the top of the page. The main conflict was whether we use python in combination with a SQLite database to render a new html page
after each search by the user, or simply use javascript to make a new call to the API and update the html with JQuery, without
rendering a new page. We eventuall settled on the JS option and made great use of the Google geolocation API as well as the
DarkSky API for our weather data. Once we got the search bar, we were able to pretty easily add the map and markers also.

In terms of the layout of the page. We drew a couple different sketches, but eventually decided on the one we have now. Weather on
the left, map on the right, extra data and the 7 day forecast on the bottom. It is appealing to the eye, easy to navigate, and provides
a positive user experience. All the html contains Bootstrap classes, so the blocks and information of the page
will adjust itself depending on the size of the window