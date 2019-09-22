import React from 'react';
import { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { FormControl } from '@material-ui/core';


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
    <div style={{ width: '300px', padding: '10px', backgroundColor: 'white' }}>
      <form>
        <FormControl>
          <label htmlFor="minVal">Min Value</label>
          <NumberFormat value={minVal} id="minVal" onChange={onChange} onBlur={props.onChange}>
          </NumberFormat>
        </FormControl>
        <FormControl>
          <label htmlFor="midVal" >Mid Value</label>
          <NumberFormat value={midVal} id="midVal" onChange={onChange} onBlur={props.onChange}>
          </NumberFormat>
        </FormControl>
        <FormControl>
          <label htmlFor="maxVal">Max Value</label>
          <NumberFormat value={maxVal} id="maxVal" onChange={onChange} onBlur={props.onChange}>
          </NumberFormat>
        </FormControl>
      </form>
    </div >
  )
}