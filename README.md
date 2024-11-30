# How to run the application

    Address: https://jisan98.github.io/WebApp_FinalProject/
    The webpage requires your permission for your location.
    It will show the name and real-time air quality state (PM2.5 concentration in the air) of your location on the header .
    The application provides you the weather information in your location.
    You can change the location by typing your city or coordinates in the text form, or clicking on the map.

    It provides you followings.
        1. 7-Day temperature & humidity forecast in line chart
        2. 7-Day weather forecast with temperature & humidity in numerical value
        3. Numerical amount of pollutants
        4. Real-time Pollutant Level in bar chart
        5. Real-time Pollutant Distribution in halfed-doughnut chart
        6. Youtube video explaining "What's in the air you breathe?"

    The webpage is divided in three sections: Dashboard, Pollutants, and About.
    There is a sidebar on the left side.
    If you hover your mouse on each option, the name of it shows up as tooltip, you can move to dedicated section by clicking it.

# The simulation process

    This application was conducted on Visual Studio Code, using HTML, CSS, Javascript as the programming language.
    The webpage was tested with Whale browser, with 1920X1080 resolution.

    While loading, check whether loading spinning is shown up on the header section well or not.
    After the webpage is fully loaded, the header changes its color depending on the air quality.
    The most of cities indicates their air quality as "Very Good".
    For simulation to see the color change, following cities can be used.
        1. New Delhi, India
        2. Lahore, Pakistan
    While changing the cities, check whether the data is successfully changed moving each section using sidebar.
    
# Used APIs and libraries

    Openweathermap API: to get air quality data
    Weather API: to get 7-day weather, temperature, humidity forecast
    Opencagedata API: to return the name of user's location
    OpenLayers API: to indicate user's location on the map

    Bootstrap: for advanced design and icons
    Font Awesome: for icons
    Chart.js: for data in chart