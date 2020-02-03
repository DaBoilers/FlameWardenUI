import React from "react";
import mapboxgl, { LngLat } from "mapbox-gl";
import "./GoogleMap.css";

<<<<<<< HEAD
=======
import db from "../../firebaseConfig";
import { Marker } from "react-simple-maps";
var image01 = require("../../assets/droneIcon.png");
>>>>>>> origin/andrew-mapbox
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

const auth = require("../../auth.json");

<<<<<<< HEAD
export class GoogleMap extends Component {
  constructor() {
    super();
    this.state = {
      markers: [],
      drones: [],
      pins: [],
      sos: [],
      checked: true,
      pinCount: 0,
      document: 0,
      x: 0,
      y: 0,
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
=======
mapboxgl.accessToken =
  "pk.eyJ1IjoiamVycnkyMDE4IiwiYSI6ImNrNjA1N3d5NTA0Zmwza252OXNpcWpzYWEifQ.lBwSxATvYgUqiyGfIvC3tw";

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 50,
      lat: 50,
      zoom: 10
>>>>>>> origin/andrew-mapbox
    };
  }

<<<<<<< HEAD
  handleChange(checked) {
    this.setState({ checked });
  }

  writeToPin(droneID, coords, pinCount) {
    var pins = firebase.database().ref("dronePins" + droneID);
    var name = "pins" + pinCount;

    pins.update({
      [name]: {
        index: pinCount,
        lat: coords.latLng.lat(),
        long: coords.latLng.lng()
      }
    });
  }
=======
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
>>>>>>> origin/andrew-mapbox

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

<<<<<<< HEAD
  onMapClicked = (props, e, coords) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        visible: this.state.windowHasClosed
      });
    } else {
      const { latLng } = coords;
      console.log(latLng.lat());
      console.log(latLng.lng());
      console.log("Pincount is: ", this.state.pinCount);
    }
    this.writeToPin(0, coords, this.state.pinCount);
    this.state.pinCount++;
    this.setState(
      (this.state.sos = this.state.sos.concat(
        <Marker
          position={{
            lat: coords.latLng.lat(),
            lng: coords.latLng.lng()
          }}
          onClick={this.onMarkerClick}
          icon={{
            anchor: new window.google.maps.Point(32, 32),
            scaledSize: new window.google.maps.Size(45, 60)
          }}
        />
      ))
    );
  };

  componentDidMount = () => {
    db.collection("fireLocations").onSnapshot(snapshot => {
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        if (change.type == "added") {
          console.log(change.doc.data());
          this.setState(
            (this.state.markers = this.state.markers.concat(
              <Marker
                name={change.doc.data().droneID}
                position={{
                  lat: change.doc.data().coords.latitude,
                  lng: change.doc.data().coords.longitude
                }}
                onClick={this.onMarkerClick}
                icon={{
                  url:
                    "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/emojione/211/fire_1f525.png",
                  anchor: new window.google.maps.Point(32, 32),
                  scaledSize: new window.google.maps.Size(48, 48)
                }}
              />
            ))
          );
        }
      });
    });

    db.collection("dronePins0").onSnapshot(snapshot => {
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        if (change.type == "added") {
          this.setState(
            (this.state.pins = this.state.pins.concat(
              <Marker
                name={change.doc.data().droneID}
                position={{
                  lat: change.doc.data().coords.latitude,
                  lng: change.doc.data().coords.longitude
                }}
                onClick={this.onMarkerClick}
                icon={{
                  anchor: new window.google.maps.Point(32, 32),
                  scaledSize: new window.google.maps.Size(48, 48)
                }}
              />
            ))
          );
        }
      });
    });

    var ref = firebase.database().ref("drone0/");
    ref.on("child_added", snapshot => {
      var droneData = snapshot.val().split(",");
      var lat = droneData[0];
      var long = droneData[1];
      var id = parseInt(droneData[2], 10);
      this.setState(
        (this.state.drones[0] = (
          <Marker
            title={droneData.id}
            position={{
              lat: lat,
              lng: long
            }}
            onClick={this.onMarkerClick}
            icon={{
              url: require("../../assets/droneIcon.png"),
              anchor: new window.google.maps.Point(32, 32),
              scaledSize: new window.google.maps.Size(64, 64)
            }}
          />
        ))
      );
    });

    ref.on("child_changed", snapshot => {
      var droneData = snapshot.val().split(",");
      var lat = droneData[0];
      var long = droneData[1];
      var id = parseInt(droneData[2], 10);
      this.setState(
        (this.state.drones[0] = (
          <Marker
            title={droneData.id}
            position={{
              lat: lat,
              lng: long
            }}
            onClick={this.onMarkerClick}
            icon={{
              url: require("../../assets/droneIcon.png"),
              anchor: new window.google.maps.Point(32, 32),
              scaledSize: new window.google.maps.Size(64, 64)
            }}
          />
        ))
      );
    });

    db.collection("sosLocations").onSnapshot(snapshot => {
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        console.log(change.doc.data());
        if (change.type === "added") {
          console.log(change.doc.data());
          this.setState(
            (this.state.sos = this.state.sos.concat(
              <Marker
                name={change.doc.data().droneId}
                position={{
                  lat: change.doc.data().coords.latitude,
                  lng: change.doc.data().coords.longitude
                }}
                onClick={this.onMarkerClick}
                icon={{
                  url: require("../../assets/sosIcon.png"),
                  anchor: new window.google.maps.Point(32, 32),
                  scaledSize: new window.google.maps.Size(45, 60)
                }}
              />
            ))
          );
        }
      });
    });
  };
=======
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

>>>>>>> origin/andrew-mapbox

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
<<<<<<< HEAD
    return (
      <div>
        {this.state.checked && (
          <Map
            google={this.props.google}
            zoom={14}
            style={style}
            onClick={this.onMapClicked}
            initialCenter={{
              // make this dependent on users location given @ login?
              lat: 40.424,
              lng: -86.929
            }}
            onClick={this.onMapClicked}
            styles={streetStyle}
            disableDefaultUI={true}
            mapType={"roadmap"}
          >
            {this.state.sos}
            {this.state.markers}
            {this.state.drones}
            {this.state.pins}
            {this.switchContainer()}
            {this.liveWindow()}
          </Map>
        )}
        {!this.state.checked && (
          <Map
            google={this.props.google}
            zoom={14}
            style={style}
            onClick={this.onMapClicked}
            initialCenter={{
              lat: 40.424,
              lng: -86.929
            }}
            disableDefaultUI={true}
            mapType={"satellite"}
          >
            {this.state.sos}
            {this.state.markers}
            {this.state.drones}
            {this.state.pins}
            {this.switchContainer()}
            {this.liveWindow()}
          </Map>
        )}
=======
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
>>>>>>> origin/andrew-mapbox
      </div>
    );
  }
}

export default GoogleMap;
