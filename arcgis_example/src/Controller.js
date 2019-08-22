import React from 'react';


export default function Controller(props) {

  console.log(props);
  return (
    <div style={{ width: '100vw', height: '10vh', padding: '10px' }}>
      <form>
        <label htmlFor="minVal">Min Value</label>
        <input type="number" value={props.minVal} id="minVal" onChange={props.onChange}></input>
        <label htmlFor="midVal" >Mid Value</label>
        <input type="number" value={props.midVal} id="midVal" onChange={props.onChange}></input>
        <label htmlFor="minVal">Max Value</label>
        <input type="number" value={props.maxVal} id="maxVal" onChange={props.onChange}></input>
      </form>
    </div >
  )
}