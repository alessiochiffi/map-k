import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import geolocator from 'geolocator';
import axios from 'axios';
import Place from '../places/places'
import Loader from '../loader/loader';
import Marker from './marker';
import './map.css';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLatLng: {
        lat: null,
        lng: null
      },
      isLoading: true,
      initiated: false,
      places: []
    }

    this.showCurrentLocation = this.showCurrentLocation.bind(this);
  }

  showCurrentLocation = () => {
    let options = {
        enableHighAccuracy: true,
        timeout: 200,
        maximumWait: 100,     // max wait time for desired accuracy
        maximumAge: 0,          // disable cache
        desiredAccuracy: 30,    // meters
        fallbackToIP: true,     // fallback to IP if Geolocation fails or rejected
    };

    geolocator.locate(options,  (err, location) => {
        if (err) return console.log(err);
        if (!err && this.state.initiated === false) {
          this.setState({
            currentLatLng: {
              lat: location.coords.latitude,
              lng: location.coords.longitude
            },
            address: location,
            initiated: true,
            isLoading: false,
          })
          return;
        }
    });
  }

  componentDidMount() {
    this.showCurrentLocation();
  }

  _onChange = ({center}) => {
    this.setState({
      currentLatLng: {
        lat: center.lat,
        lng: center.lng
      },
      isLoading: false,
      hasResults: false
    })
  }

  renderPlaces() {
    return this.state.places.map(place => {
      return (
          <Place key={place.id} place={place} />
        );
    })
  }

  render() {
    const { isLoading, currentLatLng } = this.state;
    this.showCurrentLocation();

    const searchPlaces = () => {
      const fsid = process.env.REACT_APP_FOURSQUARE_ID;
      const fscs = process.env.REACT_APP_FOURSQUARE_CS;
      const lat = this.state.currentLatLng.lat;
      const lng = this.state.currentLatLng.lng;

      axios.get(`https://api.foursquare.com/v2/venues/search?client_id=${fsid}&client_secret=${fscs}&v=20180323&intent=browse&limit=50000&radius=1000&near=${lat},${lng}`)
        .then((response) => {
          this.setState({
            places: response.data.response.venues,
            hasResults: true,
          })
        })
        .catch((error) => {
          console.log(error);
        })
    };


    const apiIsLoaded = (locations) => {
      console.log(locations);
    }

    if (isLoading) {
      return (
        <Loader />
      )
    } else {

      return (
        <div className="app-layout">
          <div className="map-layout">
            <div style={{ height: '50vh', width: '50wv' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
                center={currentLatLng}
                defaultZoom={14}
                onChange={this._onChange}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, this.state.places)}
              >
                <Marker position={currentLatLng} />
              </GoogleMapReact>
            </div>
            <div className="searchPlaces">
              <button className="btn btn-primary" onClick={searchPlaces}>Search</button>
            </div>
            <span>{currentLatLng.lat}-{currentLatLng.lng}</span>
          </div>
          <div className="results-panel container">
            {this.renderPlaces() ? this.renderPlaces() : null}
          </div>
        </div>
      );
    }
  }
}

export default Map;