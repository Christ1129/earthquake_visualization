console.log("working")

// var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/light-v10",
//     accessToken: API_KEY
// });
// We create the tile layer that will be the background of our map.
var mapLayer = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
        attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    });

// Declare map object and set it to the map element in the DOM
var map = L.map("map", {
    center: [29.876019, -107.224121],
    zoom: 3
    // layers: [mapLayer, earthquakes]
});

mapLayer.addTo(map);

// Get data url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(function (data) {

    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            weight: 0.5
        };
    }

    
    // Call create map function using the earthquakes data
    //     createMap(earthquakes);
    // };


    // Get marker color based on earthquake magnitude
    function getColor(mag) {
        if (mag > 5) {
            return "rgb(240, 107, 107)";
        }
        if (mag > 4) {
            return "rgb(240, 167, 107)";
        }
        if (mag > 3) {
            return "rgb(243, 186, 77)";
        }
        if (mag > 2) {
            return "rgb(243, 219, 77)";
        }
        if (mag > 1) {
            return "rgb(226, 243, 77)";
        }
        return "rgb(183, 243, 77)";
    }

    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4
    }

    // Declare function to create map features.
    L.geoJson(data, {
        // //Create circle markers for each earthquake in the data set.
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        // Set stle
        style: styleInfo,
        // function createFeatures(earthquakeData) {
        // // Create popup layers using earthquake title, type and magnitude
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<p>Location:" + feature.properties.title + "</p>" +
                "<p>Depth: " + feature.geometry.coordinates[2] + "</p>" +
                "<p>Magnitude: " + feature.properties.mag + "</p>");
        }

        // var earthquakes = L.geoJSON(earthquakeData, {
        //     pointToLayer: function (feature, latlng) {
        //         // Make circle radius dependent on the magnitude and get color based on the same feature
        //         return new L.CircleMarker(latlng, {
        //             radius: feature.properties.mag * 5,
        //             fillOpacity: 1,
        //             color: getColor(feature.properties.mag)
        //         })
    },
        // // Append popups on each feature
        // onEachFeature: onEachFeature
    ).addTo(map);

    // // Declare function to create map features.
    // function createFeatures(earthquakeData) {
    //     // Create popup layers using earthquake title, type and magnitude
    //     function onEachFeature(feature, layer) {
    //         layer.bindPopup("<p>" + feature.properties.title + "</p>" +
    //             "<p>Type: " + feature.properties.type + "</p>" +
    //             "<p>Magnitude: " + feature.properties.mag + "</p>");
    //     }
    //     //Create circle markers for each earthquake in the data set.
    //     var earthquakes = L.geoJSON(earthquakeData, {
    //         pointToLayer: function (feature, latlng) {
    //             // Make circle radius dependent on the magnitude and get color based on the same feature
    //             return new L.CircleMarker(latlng, {
    //                 radius: feature.properties.mag * 5,
    //                 fillOpacity: 1,
    //                 color: getColor(feature.properties.mag)
    //             })
    //         },
    //         // Append popups on each feature
    //         onEachFeature: onEachFeature
    //     });
    //     // Call create map function using the earthquakes data
    //     createMap(earthquakes);
    // };

    // Declare function to create map
    // function createMap(earthquakes) {
    // Get initial light layer
    // var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    //   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    //   tileSize: 512,
    //   maxZoom: 18,
    //   zoomOffset: -1,
    //   id: "mapbox/light-v10",
    //   accessToken: API_KEY
    // });

    // // Declare map object and set it to the map element in the DOM
    // var map = L.map("map", {
    //     center: [29.876019, -107.224121],
    //     zoom: 4.5,
    //     layers: [mapLayer, earthquakes]
    // });
    // Create a legend for the map based on the earthquakes data and colors
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = [
            "rgb(183, 243, 77)",
            "rgb(226, 243, 77)",
            "rgb(243, 219, 77)",
            "rgb(243, 186, 77)",
            "rgb(240, 167, 107)",
            "rgb(240, 107, 107)"];
        var labels = [];

        var legendInfo = "<h1>Earthquake intensity<h1>" +
            "<div class=\"labels\">" +
            "<div class=\"max\">5+</div>" +
            "<div class=\"fourth\">4-5</div>" +
            "<div class=\"third\">3-4</div>" +
            "<div class=\"second\">2-3</div>" +
            "<div class=\"first\">1-2</div>" +
            "<div class=\"min\">0-1</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        colors.forEach(function (color) {
            labels.push("<li style=\"background-color: " + color + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Append label to the map
    legend.addTo(map);

});

    // Get earthquakes data
    // d3.json(url, function (data) {
    // Create features with the earthquakes data
//     createFeatures(data.features)
// });