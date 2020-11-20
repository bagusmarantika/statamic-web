// api from Gugus Tugas Percepatan Penanganan COVID-19 Republik Indonesia
// source -> https://bnpb-inacovid19.hub.arcgis.com/datasets/rs-rujukan-update-may-2020/geoservice
const url_RS = 'https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/RS_Rujukan_Update_May_2020/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json';
const data_markers = [];
const data_content = [];

jQuery(function($) {
  // Asynchronous get map 
  var script = document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBXm8wj7kphEws6Mw5xmW59YjRCeLvzIuY&callback=initialize";
  document.body.appendChild(script);
});

async function getLongLat(url) {
    const response = await fetch(url);
    var data = await response.json();

    const rs_rujukan = data.features.filter(
        datas => datas.attributes.tipe === 'RS_RUJUKAN_NASIONAL');

    // console.log('Data RS: ', rs_rujukan);
    if (rs_rujukan) { 
        console.log('success get data RS');
    }
    setMarkers(rs_rujukan);
    setContent(rs_rujukan);
}

function setMarkers(data){
    for(let i=0; i<data.length; i++){
        data_markers.push([
            `${data[i].attributes.nama}, ${data[i].attributes.wilayah}`,
            data[i].attributes.lat,
            data[i].attributes.lon
        ]);
    }
}

function setContent(data){
    for(let i=0; i<data.length; i++){
        data_content.push({
            nama: data[i].attributes.nama,
            alamat: data[i].attributes.alamat,
            wilayah: data[i].attributes.wilayah,
            telepon: data[i].attributes.telepon 
        })
    }
}

let data = getLongLat(url_RS);
data.then(function(res){
    // console.log('marker', data_markers);
    // console.log('content', data_content);
})

function initialize() {
  var map;
  var bounds = new google.maps.LatLngBounds();
  var mapOptions = {
      mapTypeId: 'roadmap'
  };

  var infoWindowContent = [];

  // display map
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  map.setTilt(45);

  // info popup content each marker
  for(let x=0; x<data_content.length; x++){
      infoWindowContent.push([`<div class="info_content">
      <h3 class="info_location_name">${data_content[x].nama}</h3>
      <p class="info_location_text">${data_content[x].alamat}, ${data_content[x].wilayah}</p>
      <p class="info_location_call"><span><i class="fa fa-phone"></i></span>${data_content[x].telepon}</p>
      <a href="#" class="btn-link">View Location</a>
      </div>`])
  }

  // display all markers on map
  var infoWindow = new google.maps.InfoWindow({ maxWidth: 280 }),
      marker, i;

  // Looping data markers and place every one on map  
  for (i = 0; i < data_markers.length; i++) {
      var position = new google.maps.LatLng(data_markers[i][1],
          data_markers[i][2], data_markers[i][3], data_markers[i][4]);
      bounds.extend(position);
      marker = new google.maps.Marker({
          position: position,
          map: map,
          title: data_markers[i][0]
      });

      // Popup every content after hoover mouse on marker    
      google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
          return function() {
              infoWindow.setContent(infoWindowContent[i][0]);
              infoWindow.open(map, marker);
          }
      })(marker, i));

      // Automatically center the map and fit the all marker
      map.fitBounds(bounds);
  }

  // Set zoom map
  var  tilesloadedListener = google.maps.event.addListener((map),  'tilesloaded', function(event) {
      this.setZoom(5);
      google.maps.event.removeListener(tilesloadedListener);
  });

}
