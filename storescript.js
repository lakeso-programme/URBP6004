// Map 
var mymap;

$(document).ready(function (){

    
    // Define a Proj4Leaflet crs instance configured for British National Grid
    // (EPSG:27700) and the resolutions of our base map
    var crs = new L.Proj.CRS(
        'EPSG:27700',
        '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs',
        {
            resolutions: [1600,800,400,200,100,50,25,10,5,2.5,1,0.5,0.25,0.125,0.0625]
        }
    );
        proj4.defs('EPSG:27700',
        '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs')
    // Define a standard Leaflet map specifying our crs instance and define a WMS
    // base map
    mymap = new L.Map('choropleth', {
        crs: crs,
        continuousWorld: true,
        worldCopyJump: false,
        layers: [
            L.tileLayer.wms('http://t0.ads.astuntechnology.com/open/osopen/service', {
                layers: 'osopen',
                format: 'image/png',
                //maxZoom: 14,
                //minZoom: 0,
                continuousWorld: true,
                attribution: 'Astun Data Service &copy; Ordnance Survey.'
            })]
    });
    mymap.setView([51.5, -0.3], 4);
   

    //Now I use the jQuery to calculate empdata / population 
    
    //var newJson = $.extend(
        //{}, {my:"MSOA_London.json"}, {other:"emp.json"});
        // result -> {my: msoa, other:"emp"}
    
    
  

        
   

    var info = L.control();
    
    info.onAdd = function (mymap) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update =function (props) {
        this._div.innerHTML = '<h4>Greater London <br />Employment-Usual Residents Ratio</h4>' + (props?
            '<b>' + props.MSOA11NM + '</b><br />' + props.empratio.toFixed(3) : 'Hover over '); 
    };

    info.addTo(mymap);
    
    function getColor(d) {
        return d > 3.0 ? '#800026' :
               d > 2.5 ? '#BD0026' :
               d > 2.0  ? '#E31A1C' :
               d > 1.5  ? '#FC4E2A' :
               d > 1.0  ? '#FD8D3C' :
               d > 0.5   ? '#FEB24C' :
               d > 0.1   ? '#FED976' :
                        '#FFEDA0';
    };

    function style(feature) {
        return {
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillColor: getColor(feature.properties.empratio)
        };
    }

    function highlightFeature(e) {
        var layer = e.target;
        
        layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 1
        });
        

        info.update(layer.feature.properties);
    }

   var geojson;

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }
    
    function zoomToFeature(e) {
        mymap.fitBounds(e.target.getBounds());
    }



    //Now I plot the choropleth based on the empdata / population
    
    $.getJSON("emp.json", function (empdata) {
        console.log(empdata)
        $.getJSON("MSOA_London.json", function(data){
            geojson = L.Proj.geoJson(data, {
                style: style,
                onEachFeature: function(feature, layer) {

                    $.each(empdata, function(index, dob) {
                        if (dob.Workplace == feature.properties.MSOA11CD) {
                            console.log(dob)
                            feature.properties['empratio'] = dob.All / feature.properties.USUALRES
                            return
                            
                        }
                    })

                    layer.on(
                        {
                            mouseover: highlightFeature,
                            mouseout: resetHighlight,
                            click: zoomToFeature
                        }
                    );
                }
                
                }).addTo(mymap);
        });
    })
        
    
    
    
        
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (mymap) {
        
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 0.1, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0],
        labels = [],
        from, to;
        
    // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i+1];
            labels.push(
            '<i style ="background:' + getColor(from+1) + '"></i> ' +
            from + (to ? '&ndash;' + to : ' & over')
            );
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
        
    legend.addTo(mymap);           

createChart2();
createChart1();
    

});   