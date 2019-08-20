/*
* this is the reducer component for the summary side of the app State
*/
//import { todoCounts } from '../actions'
import React from 'react'

const todoCount = (state = 0, action) => {
   return state++
}

export default todoCount