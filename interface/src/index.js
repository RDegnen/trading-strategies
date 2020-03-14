import Plotly from 'plotly.js-dist'
import data from '../../data/ema-data.json'

import './style.css'

function component() {
  const element = document.createElement('div')
  const plotlyData = Object.keys(data).map(key => ({
    x: data[key].map(({ x }) => x),
    y: data[key].map(({ y }) => y),
    type: 'scatter',
    name: key
  }))
  const layout = {
    width: 2000,
    height: 800
  }

  Plotly.newPlot(element, plotlyData, layout)

  return element
}

document.body.appendChild(component())
