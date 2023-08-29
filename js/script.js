// строгий режим
"use strict"


let cubeBody = document.querySelector('.cube__body');
let rangeY = document.querySelector('#rotateY');
let rangeX = document.querySelector('#rotateX');
let rangeZ = document.querySelector('#rotateZ');


function rotate() {
   cubeBody.style.cssText = `
   --y: ${rangeY.value}deg;
   --x: ${rangeX.value}deg;
   --z: ${rangeZ.value}deg;
   `
}


rangeY.addEventListener('input', rotate);
rangeX.addEventListener('input', rotate);
rangeZ.addEventListener('input', rotate);








