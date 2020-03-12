import Plotly from 'plotly.js-dist'
import data from '../../data/ema-data.json'

import './style.css'

function component() {
  const element = document.createElement('div')

  Plotly.newPlot(element, Object.keys(data).map(key => ({
    x: data[key].map(({ x }) => x),
    y: data[key].map(({ y }) => y),
    type: 'scatter',
    name: key
  })))

  return element
}

document.body.appendChild(component())
