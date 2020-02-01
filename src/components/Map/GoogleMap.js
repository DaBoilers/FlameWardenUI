import React from "react";
import mapboxgl, { LngLat } from "mapbox-gl";
import "./GoogleMap.css";

import db from "../../firebaseConfig";
import { Marker } from "react-simple-maps";
var image01 = require("../../assets/droneIcon.png");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

const auth = require("../../auth.json");

mapboxgl.accessToken =
  "pk.eyJ1IjoiamVycnkyMDE4IiwiYSI6ImNrNjA1N3d5NTA0Zmwza252OXNpcWpzYWEifQ.lBwSxATvYgUqiyGfIvC3tw";

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 50,
      lat: 50,
      zoom: 10
    };
  }

  componentDidMount = () => {
    const { lng, lat, zoom } = this.state;
    
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom: zoom
    });

    map.on("move", () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    var drones = {};
    var fires = {};

    
    firebase
      .database()
      .ref("drones")
      .on("child_added", function(snapshot) {
        
        var el = document.createElement("div");
        el.className = 'marker';

        var drone = new mapboxgl.Marker(el).setLngLat([snapshot.val().lat, snapshot.val().lng]).addTo(map);
        drones[snapshot.val().id] = drone;
    });

    firebase
    .database()
    .ref("drones")
    .on("child_changed", function(snapshot) {
      drones[snapshot.val().id].setLngLat([snapshot.val().lat, snapshot.val().lng]);
    });

    firebase
      .database()
      .ref("fires")
      .on("child_added", function(snapshot) {
        
        var fir = document.createElement("div");
        fir.className = 'fire';

        var fire = new mapboxgl.Marker(fir).setLngLat([snapshot.val().lat, snapshot.val().lng]).addTo(map);
        fires[snapshot.val().id] = fire;
    });


    /* the fires aren't going to be moving around, so 
     * we don't need this for now. If we want to modify 
     * the program so the fires can move, 
     * the code is right here \/\/\/.
    // firebase
    // .database()
    // .ref("fires")
    // .on("child_changed", function(snapshot) {
    //   fires[snapshot.val().id].setLngLat([snapshot.val().lat, snapshot.val().lng]);
    // });
    */

  };





  onMapLoaded(event) {
    event.map.resize();
  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div className="test">
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div
          ref={el => (this.mapContainer = el)}
          className="absolute top right left bottom"
        />
      </div>
    );
  }
}

export default GoogleMap;
