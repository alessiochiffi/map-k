import React from 'react';
import './places.css'

const Place = (props) => {
  const results = [props]

  return (
    results.map(props => {
      console.log(props);

      const category =
        props.place.categories[0] !== undefined ?
        props.place.categories[0].name :
        null;

      return (
        <div key={props.place.id} className="card">
          <h6>{props.place.name}</h6>
          <span className="card__category">{category}</span>
        </div>
      )
    })
  )
}

export default Place;