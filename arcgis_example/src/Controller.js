import React from 'react';
import { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';


export default function Controller(props) {
  const [minVal, setMinVal] = useState(props.minVal);
  const [midVal, setMidVal] = useState(props.midVal);
  const [maxVal, setMaxVal] = useState(props.maxVal);

  const onChange = (e) => {
    if (e.target.id == "minVal") setMinVal(e.target.value);
    if (e.target.id == "midVal") setMidVal(e.target.value);
    if (e.target.id == "maxVal") setMaxVal(e.target.value);
  }

  console.log(props);
  return (
    <div style={{ width: '100vw', height: '10vh', padding: '10px' }}>
      <form>
        <label htmlFor="minVal">Min Value</label>
        <NumberFormat value={minVal} id="minVal" onChange={onChange} onBlur={props.onChange}></NumberFormat>
        <label htmlFor="midVal" >Mid Value</label>
        <NumberFormat value={midVal} id="midVal" onChange={onChange} onBlur={props.onChange}></NumberFormat>
        <label htmlFor="maxVal">Max Value</label>
        <NumberFormat value={maxVal} id="maxVal" onChange={onChange} onBlur={props.onChange}></NumberFormat>
      </form>
    </div >
  )
}