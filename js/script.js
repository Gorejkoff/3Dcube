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


let inputBody = document.querySelector('.input-body');

function autoRotate() {
   rangeY.value == 360 && (rangeY.value = 0);
   rangeX.value == 0 && (rangeX.value = 360);
   rangeZ.value == 0 && (rangeZ.value = 360);


   rangeY.value = Number(rangeY.value) + 0.1;
   rangeX.value = Number(rangeX.value) - 0.1;
   rangeZ.value = Number(rangeZ.value) - 0.1;

   cubeBody.style.cssText = `
   --y: ${rangeY.value}deg;
   --x: ${rangeX.value}deg;
   --z: ${rangeZ.value}deg;
   `;

   setTimeout(autoRotate, 16.666)
}

/* setTimeout(autoRotate, 3000) */


autoRotate()



