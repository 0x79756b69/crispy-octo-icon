const MersenneTwister = require('mersenne-twister');
const paperGen = require('./paper')
const colors = require('./colors')
const shapeCount = 4
const svgns = 'http://www.w3.org/2000/svg'

module.exports = generateIdenticon

let generator
function generateIdenticon(diameter, seed) {
  generator = new MersenneTwister(seed);
  const remainingColors = hueShift(colors.slice(), generator);
  // console.log(remainingColors);

  const elements = paperGen(diameter, genColor(remainingColors));
  const container = elements.container;

  const svg = document.createElementNS(svgns, 'svg');
  svg.setAttributeNS(null, 'x', '0')
  svg.setAttributeNS(null, 'y', '0')
  svg.setAttributeNS(null, 'width', diameter)
  svg.setAttributeNS(null, 'height', diameter)

  container.appendChild(svg)

  for(let i = 0; i < shapeCount - 1; i++) {
    if (generator.random() < 0.5) {
      genRect(remainingColors, diameter, i, shapeCount - 1, svg)
    } else {
      genCircle(remainingColors, diameter, i, shapeCount - 1, svg)
    }
  }

  return container
}

function genRect(remainingColors, diameter, i, total, svg) {
  const center = diameter / 2;

  const shape = document.createElementNS(svgns, 'rect');
  shape.setAttributeNS(null, 'x', '0')
  shape.setAttributeNS(null, 'y', '0')
  shape.setAttributeNS(null, 'width', diameter)
  shape.setAttributeNS(null, 'height', diameter)
  // shape.setAttributeNS(null, 'r', diameter)

  const firstRot = generator.random();
  const angle = Math.PI * 2 * firstRot;
  const velocity = diameter / total * generator.random() + (i * diameter / total);

  const tx = (Math.cos(angle) * velocity);
  const ty = (Math.sin(angle) * velocity);

  const translate = 'translate(' + tx + ' ' +  ty + ')'

  // Third random is a shape rotation on top of all of that.
  const secondRot = generator.random()
  const rot = (firstRot * 360) + secondRot * 180
  const rotate = 'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')'
  const transform = translate + ' ' + rotate
  shape.setAttributeNS(null, 'transform', transform)
  const fill = genColor(remainingColors)
  shape.setAttributeNS(null, 'fill', fill)

  svg.appendChild(shape)
}
function genCircle(remainingColors, diameter, i, total, svg) {
  const center = diameter / 2;

  const shape = document.createElementNS(svgns, 'circle');
  // size
  shape.setAttributeNS(null, 'cx', center)
  shape.setAttributeNS(null, 'cy', center)
  shape.setAttributeNS(null, 'r', center*0.8)

  // x,y
  const firstRot = generator.random();
  const angle = Math.PI* 2 * firstRot;
  const velocity = center / total * generator.random() + (i * diameter / total);
  const tx = (Math.cos(angle) * velocity);
  const ty = (Math.sin(angle) * velocity);
  console.log(velocity, angle, Math.cos(angle));
  const transform = 'translate(' + tx + ' ' +  ty + ')'
  shape.setAttributeNS(null, 'transform', transform)
  const stroke = genColor(remainingColors)
  shape.setAttributeNS(null, 'stroke', stroke)
  shape.setAttributeNS(null, 'stroke-width', center*0.1)
  shape.setAttributeNS(null, 'fill', 'none')

  svg.appendChild(shape)
}
function genPath(remainingColors, diameter, i, total, svg) {
  const center = diameter / 2;

  const shape = document.createElementNS(svgns, 'circle');
  // size
  shape.setAttributeNS(null, 'cx', center)
  shape.setAttributeNS(null, 'cy', center)
  shape.setAttributeNS(null, 'r', center*0.8)

  // x,y
  const firstRot = generator.random();
  const angle = Math.PI* 2 * firstRot;
  const velocity = diameter / total * generator.random() + (i * diameter / total);
  const tx = (Math.cos(angle) * velocity);
  const ty = (Math.sin(angle) * velocity);
  const transform = 'translate(' + tx + ' ' +  ty + ')'
  shape.setAttributeNS(null, 'transform', transform)
  const stroke = genColor(remainingColors)
  shape.setAttributeNS(null, 'stroke', stroke)
  shape.setAttributeNS(null, 'stroke-width', center*0.1)
  shape.setAttributeNS(null, 'fill', 'none')

  svg.appendChild(shape)
}




function genColor(colors) {
  const rand = generator.random();
  const idx = Math.floor(colors.length * rand);
  const color = colors.splice(idx, 1)[0];
  return color
}
// 色相を保ったまま、色の変更
const wobble = 30
function hueShift(colors, generator) {
  const amount = (generator.random() * 30) - (wobble / 2)
  const rotate = (hex) => colorRotate(hex, amount)
  return colors.map(rotate)
}

function colorRotate(hex, degrees) {
  const hsl = hexToHSL(hex)
  let hue = hsl.h
  hue = (hue + degrees) % 360;
  hue = hue < 0 ? 360 + hue : hue;
  hsl.h = hue;
  return HSLToHex(hsl);
}

function hexToHSL(hex) {
  // Convert hex to RGB first
  let r = "0x" + hex[1] + hex[2];
  let g = "0x" + hex[3] + hex[4];
  let b = "0x" + hex[5] + hex[6];
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin;
  let h = 0,
      l = 0,
      s = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {h, s, l}
}

function HSLToHex(hsl) {
  let {h, s, l} = hsl
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0, 
      b = 0; 

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}