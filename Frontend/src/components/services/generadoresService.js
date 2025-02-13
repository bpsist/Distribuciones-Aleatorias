
import axios from "axios";
import fileDownload from "js-file-download";

/*

TODOS LOS SERVICIOS DEBEN DEVOLVER LOS DATOS EN ESTE FORMATO
data: {
  chiCalculado: number
  intervalos: [
    {intervalo, 
    linf,
    lsup, 
    fo: frecuenciaObservada
    fe: frecuenciaEsperada
    terminoChi}
  ]
}
*/

let httpService = axios.create({baseURL: 'http://localhost:5174/'})

const responseMock = {chiCalculado: 27.97, intervalos: [
  {intervalo: 1, linf: 0.0068, lsup: 0.0646, fo: 40, fe: 15.8824, terminoChi: 2.1786},
  {intervalo: 2, linf: 0.0646, lsup: 0.1224, fo: 15, fe: 15.8824, terminoChi: 0.0490},
  {intervalo: 3, linf: 0.1224, lsup: 0.1803, fo: 19, fe: 15.8824, terminoChi: 0.6120},
  {intervalo: 4, linf: 0.1803, lsup: 0.1224, fo: 15, fe: 15.8824, terminoChi: 0.0490},
  {intervalo: 5, linf: 0.2381, lsup: 0.2959, fo: 13, fe: 15.8824, terminoChi: 0.5231},
]}

async function uniforme(n, k, linf, lsup) {
  console.log(`n: ${n}, k: ${k}, linf: ${linf}, lsup: ${lsup}`);
  let results = await httpService.get('/uniforme', {
    params: {
      n: n,
      k: k,
      linf: linf,
      lsup: lsup
    }
  })
  return results.data

  }

/*async function poisson(n, k, lambda) {
  console.log(`n: ${n}, k: ${k}, lambda: ${lambda}`);
  let results = await httpService.get('/poisson', {
    params: {
      n: n,
      k: k,
      lambda: lambda
    }
  })
  return results.data
}*/

async function exponencial(n, k, lambda) {
  console.log(`n: ${n}, k: ${k}, lambda: ${lambda}`);
  let results = await httpService.get('/exponencial', {
    params: {
      n: n,
      k: k,
      lambda: lambda
    }
  })
  return results.data
}

async function normal(n, k, media, desviacion) {
  console.log(`n: ${n}, k: ${k}, media: ${media}, desviacion: ${desviacion}`);
  let results = await httpService.get('/normal', {
    params: {
      n: n,
      k: k,
      media: media,
      desviacion: desviacion
    }
  })
  return results.data
}

async function descargarResultados() {
  httpService.get('/result-download').then(resp => {
    fileDownload(resp.data, 'results')
  })
}

let generadoresService = {uniforme, exponencial, normal, descargarResultados}
export default generadoresService