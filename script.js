$(document).ready(function(){
    var weatherReports = {};
    rotationCounter = 0;
    //array of image paths to switch between pictures of the Macho Man depending on on the weater
    var machoManImages = [
        "./images/Macho-Man-Normal.png",
        "./images/Macho-Man-Glasses.png",
        "./images/Macho-Man-Umbrella.png",
        "./images/Macho-Man-Scarf.png"
    ]
    
    getWeatherData();
    
    //Gets raw weather data from weather server
    function getWeatherData(){
        $.get('http://api.geonames.org/weatherJSON?north=41&south=39&east=-104&west=-106&username=ertyseidohl', function(response){
            //Rotate through weather reports based on interval
            setInterval(buildAndDisplayWeatherReport, 5000);
            weatherReports =  response.weatherObservations;
        })
    }

    function buildAndDisplayWeatherReport(){
        //Take raw weather report from rotation and clean up data
        var weatherObservation = weatherReports[rotationCounter];
        var cloudReport = getCloudReport(weatherObservation.clouds);
        var location = sanitizeLocation(weatherObservation.stationName);
        var temperature = convertCelciusToFahrenheit(weatherObservation.temperature);

        //Form a Macho Man Randy Savage style phrase about the weather
        var weatherQuote = "OH YEAAAAHH! It's " + temperature +  " degrees in " + location +
        " with " + cloudReport + " PUNK! OOOOOOHH YEAAAAH...";

        displayWeatherReport(weatherQuote, cloudReport,weatherObservation.humidity, temperature)
        updateRotation();
    }


    function displayWeatherReport(weatherQuote,cloudReport, humidity, temperature){
        //display report in html
        $('#weather-report').html(weatherQuote);
        generateMachoMan(cloudReport,humidity, temperature );
    }

    function updateRotation(){
        rotationCounter++;
        //cycle back through weather reports once last report is reached
        rotationCounter = rotationCounter % weatherReports.length;
    }

    function getCloudReport(cloudConditions){
        //sanitize cloud report
        if(cloudConditions == "n/a"){
            return "no clouds";
        }
        return cloudConditions.toLowerCase();
    }
    function sanitizeLocation(location){
        //if there is a comma, grab the part before the comma
        location = toTitleCase(location);
        //Splits the location at a "," and takes the piece before the ","
        location = location.split(",")[0];
        location = location.split("/")[0];
        //Get rid of the word "muni" if the location contains it
        location = location.replace("muni","");
        return location;
    }

    function toTitleCase(str)
    {
        //Regular expression looks for alphanumeric characters and whitespice to apply uppercasing to 
        return str.replace(/\w\S*/g, function(txt){
            //Creates a simple title case string with first letter upper case and rest lowercase
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function convertCelciusToFahrenheit(tempInCelcius){ 
        //formula for converting a celcius temperature to Fahrenheit
        var tempInFahrenheit = Math.round((tempInCelcius * 9 / 5) + 32);
        return tempInFahrenheit;
    }

    function generateMachoMan(clouds,humidity,temperatureInF){
        //high temperature, no clouds ==> sun glasses
        //low temperature ==> scarf
        //high humidity = umbrella
        //otherwise normal macho man
        
        if(temperatureInF > 70 && clouds == "no clouds"){
            buildMachoManImageTag(machoManImages[1]);
        }else if(temperatureInF < 32){
            buildMachoManImageTag(machoManImages[3]);
        }else if(humidity > 70){
            buildMachoManImageTag(machoManImages[2]);
        }else{
            buildMachoManImageTag(machoManImages[0]);
        }
    }

    function buildMachoManImageTag(machoManImagePath){
        $('#macho-man').empty().append(buildImageTag(machoManImagePath, "Macho Weather Man Randy Savage"));
    }

    //Builds a generic image tag with a path and alt attribute
    function buildImageTag(imagePath, altText){
        var imageTag = "<img src='" + imagePath + "' alt='" + altText + "'/>";
        return imageTag;
    }
});