
import React from 'react';

const Marker = (props) => {
    const { currentLatLng } = props;
    return (
      <div className="marker"
        position={currentLatLng}
      />
    );
  };

  export default Marker;