import React from "react";
import mapboxgl, { LngLat } from "mapbox-gl";
import "./GoogleMap.css";
import db from "../../firebaseConfig";
import { Marker } from "react-simple-maps";
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
      lng: 5,
      lat: 34,
      zoom: 2
    };
  }

  componentDidMount = () => {
    const { lng, lat, zoom } = this.state;

    var droneList = [];

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [lng, lat],
      zoom: zoom
    });

    map.on("move", () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    var drone0 = new mapboxgl.Marker().setLngLat([50, 50]).addTo(map);

    firebase
      .database()
      .ref("drone0/lng")
      .on("value", function(snapshot) {
        console.log(snapshot.val());
        var lat = drone0.getLngLat().lat;
        drone0.setLngLat([lat, snapshot.val()]);
      });

    firebase
      .database()
      .ref("drone0/lat")
      .on("value", function(snapshot) {
        console.log(snapshot.val());
        var lng = drone0.getLngLat().lng;
        drone0.setLngLat([snapshot.val(), lng]);
      });
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
