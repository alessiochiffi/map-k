import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import geolocator from 'geolocator';
import axios from 'axios';
import Loader from '../loader/loader';
import './map.css'

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

class SimpleMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLatLng: {
        lat: null,
        lng: null
      },
      isLoading: true
    }

    this.showCurrentLocation = this.showCurrentLocation.bind(this);
  }

  showCurrentLocation = () => {
    let options = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumWait: 100,     // max wait time for desired accuracy
        maximumAge: 0,          // disable cache
        desiredAccuracy: 30,    // meters
        fallbackToIP: true,     // fallback to IP if Geolocation fails or rejected
    };

    geolocator.locate(options,  (err, location) => {
        if (err) return console.log(err);
        if (location) {
          this.setState({
            currentLatLng: {
              lat: location.coords.latitude,
              lng: location.coords.longitude
            },
            isLoading: false
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

  renderProducts() {
    return this.state.places.map(place => {
        return (
            <div key={place.id}>
                <p>{place.name}</p>
            </div>
        );
    })
  }

  render() {
    this.showCurrentLocation();

    const searchPlaces = () => {
      const fsid = process.env.REACT_APP_FOURSQUARE_ID;
      const fscs = process.env.REACT_APP_FOURSQUARE_CS;
      const lat = this.state.currentLatLng.lat;
      const lng = this.state.currentLatLng.lng;

      axios.get(`https://api.foursquare.com/v2/venues/search?client_id=${fsid}&client_secret=${fscs}&v=20180323&intent=browse&limit=50&radius=5000&near=${lat},${lng}`)
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


    const { isLoading, currentLatLng, hasResults } = this.state;

    if (hasResults) {
      return(this.renderProducts())
    }

    if (isLoading) {
      return (
        <Loader />
      )
    } else {
      return (
        <div className="map-layout">
          <div style={{ height: '80vh', width: '50wv' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
              defaultCenter={currentLatLng}
              defaultZoom={14}
              onChange={this._onChange}
            >
            </GoogleMapReact>
          </div>
          <div className="searchPlaces">
            <button onClick={searchPlaces}>Search</button>
          </div>
        </div>
      );
    }
  }
}

export default SimpleMap;