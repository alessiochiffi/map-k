import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import geolocator from 'geolocator';
import axios from 'axios';
import Place from '../places/places'
import Loader from '../loader/loader';
import Marker from './marker';
import './map.css';
import '../weather/weather.scss';


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
        timeout: 100000,
        maximumWait: 1000,     // max wait time for desired accuracy
        maximumAge: 0,          // disable cache
        desiredAccuracy: 300,    // meters
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
          console.log(this.state);
          this.showWeather()
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
      hasResults: false
    })
    this.showWeather()
    console.log(this.state)
  }

  renderPlaces() {
    return this.state.places.map(place => {
      return (
          <Place key={place.id} place={place} />
        );
    })
  }

  renderWeather() {
    return this.state.weather ?
      (
        <div className="weather__widget">
          <div className="weather__location">
            <span>{this.state.weather.name}</span>
          </div>
          <div className="weather__details">
            <span>Temp <b>{this.state.weather.main.temp} C</b></span>
            <div className="weather__values">
              <span>{this.state.weather.weather[0].main}</span>
              <img alt="icon" src={`http://openweathermap.org/img/w/${this.state.weather.weather[0].icon}.png`} />
            </div>
          </div>
        </div>
      )
    : null;
  }

  showWeather() {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${this.state.currentLatLng.lat}&lon=${this.state.currentLatLng.lng}&units=metric&appid=3fb9669ae49b25530b94f992b51a6343`)
    .then((response) => {
      this.setState({
        weather: response.data,
      })
    })
    .catch((error) => {
      console.log(error);
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
                defaultCenter={currentLatLng}
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
            <span className="map__coords">Coords {currentLatLng.lat}-{currentLatLng.lng}</span>
              {this.renderWeather() ? this.renderWeather() : null}

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