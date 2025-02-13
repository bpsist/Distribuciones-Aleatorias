/* FORMATO DE RESULTADOS:
  {
    chiCalcu,
    intervalos: [
      {
        nroIntervalo
        linf
        lsup
        fo: frecuencias observadas
        fe: frecuencias esperadas
        terminoChi: resultado de la formula (Fo - Fe)^2 / Fe
      }
    ]
  }

*/

import generadorRandoms from './Generadores/generadorRandom.js';
import generadorUniforme from './Generadores/generardorUniforme.js'; 
import pruebaChi from './pruebaChi.js';
import generadorExponencial from './Generadores/generadorExponencial.js'
import generadorNormal from './Generadores/generadorNormal.js';
import fs from 'fs';

let numerosAleatorios = [];
let variablesAleatorias = [];

async function uniforme(n, k, linf, lsup) {
  numerosAleatorios = [];
  variablesAleatorias = [];

  await generadorRandoms.generarNumeros(n,numerosAleatorios);
  //console.log(`n: ${n}, k: ${k}, limInf: ${linf}, limsup: ${lsup}`);
  
  variablesAleatorias = await generadorUniforme.generarDistribucionUniforme(linf,lsup,numerosAleatorios);
  
  //console.log('Randoms Uniformes: ',variablesAleatorias);
  
  //Evaluar frecuencia esperada por distribucion.
  let resultado = await pruebaChi.pruebaCHI(variablesAleatorias,k, 1)

  return resultado;
}

async function exponencial(n, k, lambda) {

  numerosAleatorios = [];
  variablesAleatorias = [];

  //console.log(`n: ${n}, k: ${k}, lambda: ${lambda}`);
  
  await generadorRandoms.generarNumeros(n , numerosAleatorios);
  variablesAleatorias = await generadorExponencial.generarDistribucionExponencial(lambda, numerosAleatorios);
  //console.log('Randoms Exponencial: ', variablesAleatorias);
  
  let resultado= await pruebaChi.pruebaCHI(variablesAleatorias, k, 2);

  return resultado;
}

async function normal(n, k, media, desviacion) {

    numerosAleatorios = [];
    variablesAleatorias = [];
    
    //console.log(`n: ${n}, k: ${k}, media: ${media}, desviacion: ${desviacion}`);

    variablesAleatorias = await generadorNormal.generarDistribucionNormal(n, media, desviacion);

    //console.log('Randoms Normal: ', variablesAleatorias);

    let resultado = await pruebaChi.pruebaCHI(variablesAleatorias, k, 3);

    return resultado;
  }

async function generateCSV(fileTitle) {
  
  let csvContent = '';
  variablesAleatorias.forEach(n => {
    csvContent += n.toFixed(4) + ',\n';
  })

  await fs.promises.writeFile(`${fileTitle}`, csvContent, (err) => {
    if (err) throw err;
    //console.log("file saved: ", fileTitle);
  });
}

const generadoresService = {uniforme, normal, exponencial, generateCSV};
export default generadoresService;
