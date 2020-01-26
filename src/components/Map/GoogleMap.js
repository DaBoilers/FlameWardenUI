import React, { Component } from "react";
import { style, streetStyle } from "./GoogleMapStyles";
import Switch from "react-switch";
import "./GoogleMap.css";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import db from "../../firebaseConfig";

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

const auth = require("../../auth.json");

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
    };
    this.handleChange = this.handleChange.bind(this);
  }

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

  onMarkerClick = (props, marker, e) => {
    this.setState({
      x: e.latLng.lat(),
      y: e.latLng.lng(),
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

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

  switchContainer = () => {
    return (
      <div>
        <div className="switch-container">
          <Switch
            onChange={this.handleChange}
            checked={this.state.checked}
            checkedIcon={false}
            uncheckedIcon={false}
          />
        </div>
      </div>
    );
  };

  liveWindow = () => {
    return (
      <InfoWindow
        marker={this.state.activeMarker}
        person={this.state.activeMarker}
        visible={this.state.showingInfoWindow}
      >
        <div>
          {"(" + this.state.x.toFixed(6) + ", " + this.state.y.toFixed(6) + ")"}
        </div>
      </InfoWindow>
    );
  };

  render() {
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
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: auth.API_KEY
})(GoogleMap);
