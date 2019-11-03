import React from 'react'
import './loader.css'

const Loader = () => {
  return(
    <div className="loaderContainer">
      <img src="https://www.alessioch.com/static/media/logoalessiochf.eab475a2.png" alt=""/>
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Loader;