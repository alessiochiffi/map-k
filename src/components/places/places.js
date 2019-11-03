import React from 'react';

const Place = (props) => {
  // props.map(props => {
  //   return (
  //     <div key={props.key}>
  //       <p>{props.name}</p>
  //     </div>
  //   )
  // });

  const testArray = props;

  let currentState;

  currentState = testArray.map((value) => value)

  console.log('this is ', testArray)

  console.log(currentState);
  return (
    <div>{currentState}</div>
  )
}

export default Place;