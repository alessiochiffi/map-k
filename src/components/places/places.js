import React from 'react';
import './places.css'

const Places = (props) => {
  const results = [props]

  return (
    results.map(props => {
      return (
        <div key={props.place.id} className="card">
          <h6>{props.place.name}</h6>
        </div>
      )
    })
  )
}

export default Places;