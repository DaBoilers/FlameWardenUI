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

  //this function enables the react app of the map to be interactive and dynamic.
  //whenever a drone moves, its icon will move on the map, and whenever it adds a new
  //fire location to the real time database, it will appear without the user needing 
  //to refresh the page.
  componentDidMount = () => {
    const { lng, lat, zoom } = this.state;
    
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom: zoom
    });

    //this enables the map to be moved around by the user.
    map.on("move", () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    //these two dictionaries are used to store
    //all of the drone and fire icons with unique 
    //id's or "keys", so they can instantly be referenced.
    var drones = {};
    var fires = {};

    //this checks for new drones being added to the system, 
    //while it is running
    firebase
      .database()
      .ref("drones")
      .on("child_added", function(snapshot) {
        
        var el = document.createElement("div");
        el.className = 'marker';

        var drone = new mapboxgl.Marker(el).setLngLat([snapshot.val().lat, snapshot.val().lng]).addTo(map);
        drones[snapshot.val().id] = drone;
    });

    //this checks for when a drone's location in the database moves,
    //and it then updates that drone's icon on the map
    firebase
    .database()
    .ref("drones")
    .on("child_changed", function(snapshot) {
      drones[snapshot.val().id].setLngLat([snapshot.val().lat, snapshot.val().lng]);
    });


    //this checks for new fires being added to the database by the drones,
    //and then plots those fire icons onto the map.
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
     * the program so the drone can potentially update the fire's location,
     * we have include the code for that below:
     * 
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


  //this function renders the map into the web page
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
