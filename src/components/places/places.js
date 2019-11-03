import React from 'react';
import './places.css'

const Places = (props) => {
  console.log(props);
  const results = [props]

  return (
    results.map(props => {
      return (
        <div key={props.place.id}>
          <p>{props.place.name}</p>
        </div>
      )
    })
  )
}

export default Places;