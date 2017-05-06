    //$(document).ready(function(){
        var weatherReports = {};
        counter = 0;
        var machoManImages = [
            "./images/Macho-Man-Normal.png",
            "./images/Macho-Man-Glasses.png",
            "./images/Macho-Man-Umbrella.png",
            "./images/Macho-Man-Scarf.png"
        ]
        
        getWeatherData();
     
        function getWeatherData(){
            $.get('http://api.geonames.org/weatherJSON?north=41&south=39&east=-104&west=-106&username=ertyseidohl', function(response){
                setInterval(buildWeatherReport, 5000);
                weatherReports =  response.weatherObservations;
			})
        }

        function buildWeatherReport(){

            var weatherObservation = weatherReports[counter];
            var cloudReport = getCloudReport(weatherObservation.clouds);
            var location = parseLocation();

            var phrase = "OH YEAAAAHH! It's " + weatherObservation.temperature +  " degrees in " + parseLocation(weatherObservation.stationName) +
            " with " + cloudReport + " PUNK! OOOOOOHH YEAAAAH...";

            //display report
            $('#weather-report').html(phrase);
            generateMachoMan(cloudReport,weatherObservation.humidity, weatherObservation.temperature );
            counter++;
            //cycle back through weather reports once last report is reached
            counter = counter % weatherReports.length;
           
        }

        function getCloudReport(cloudConditions){
            if(cloudConditions == "n/a"){
                return "no clouds";
            }
            return cloudConditions;
        }
        function parseLocation(location){
            //TODO: 
            //if there is a comma, grab the part before the comma
            //If no comma, just grab the first word
            return location;

        }

        function convertCelciusToFahrenheit(tempInCelcius){
            
        }

        function generateMachoMan(clouds,humidity,temperature){
            //high temperature, no clouds ==> sun glasses
            //low temperature ==> scarf
            //high humidity = umbrella
            //otherwise normal macho man
            
            if(temperature > 70 && clouds == "no clouds"){
                $('#macho-man').empty().append(buildImageTag(machoManImages[1]));
            }else if(temperature < 32){
                $('#macho-man').empty().append(buildImageTag(machoManImages[3]));
            }else if(humidity > 70){
                $('#macho-man').empty().append(buildImageTag(machoManImages[2]));
            }else{
                $('#macho-man').empty().append(buildImageTag(machoManImages[0]));
            }
        }

        function buildImageTag(imagePath){
            var imageTag = "<img src='" + imagePath + "'/>";
            return imageTag;
        }