import { loadModules } from 'esri-loader';

export function getRenderer(min, mid, max, filter = false) {
  let filters = [
    { value: min - 0.0001, color: "#ffffff", opacity: ".05" },
    { value: max + 0.0001, color: "#ffffff", opacity: "0.5" }
  ];

  let stops = [
    { value: min, color: "#ff0000" },
    { value: mid, color: "#ffff00" },
    { value: max, color: "0000ff" }
  ];

  if (filter) {
    stops.unshift(filters[0]);
    stops.push(filters[1]);
  }

  return {
    type: "simple", //autocasts
    symbol: {
      type: "simple-marker", //autocasts
      size: 12,
      color: "white",
      outline: {
        width: 0.5,
        color: "black"
      }
    },
    visualVariables: [{
      type: "color",
      field: "value",
      stops: stops
    }]
  };
}

export const labelClass = {
  symbol: {
    type: "text",
    font: { family: "Playfair Display", size: 9 }
  },
  labelPlacement: "above-center",
  labelExpression: '[value]',
  minScale: 3000
};