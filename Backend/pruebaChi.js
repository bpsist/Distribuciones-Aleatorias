import jStat from 'jstat';

async function pruebaCHI(numerosA, k, tipo){
    const n = numerosA.length;
    const k_Intervalos = parseInt(k);
    const { max, min } = await encontrarMaximoMinimo(numerosA);
    const rango = parseFloat((max - min).toFixed(4));
    const amplitud = parseFloat((rango / k_Intervalos));
    const media = await calculoMedia(numerosA);
    const varianza = await calcularVarianza(numerosA, media);
    const desviacion = Math.sqrt(varianza);
        
    const intervalos = [];
    for (let i = 0; i < k_Intervalos; i++) {
        const intervaloInicial = (parseFloat(min) + (i * amplitud));
        let intervaloFinal;
        if (i === k_Intervalos - 1) {
            intervaloFinal = max; // Último intervalo
        } else {
            intervaloFinal = (parseFloat(intervaloInicial) + parseFloat(amplitud));
        }
        intervalos.push({ nroIntervalo: i + 1, linf: parseFloat(intervaloInicial), lsup: parseFloat(intervaloFinal) });
    }

    const frecuenciaObservada = [];
    for (let i = 0; i < k_Intervalos; i++) {

        if (i == k_Intervalos - 1) {
            const intervalo = intervalos[i];
            const observada = await numerosA.filter(numero => numero >= intervalo.linf && numero <= intervalo.lsup).length;
            frecuenciaObservada.push(parseFloat(observada));
        } else {
            const intervalo = intervalos[i];
            const observada = await numerosA.filter(numero => numero >= intervalo.linf && numero < intervalo.lsup).length;
            frecuenciaObservada.push(parseFloat(observada));
        } 
    }

    //Aspecto variable para cada DISTR
    // Importante a tener en cuenta que se modifica la cantidad de intervalos
    let frecuenciaEsperada = [];
    for (let i = 0; i< k_Intervalos; i++){
        let frecuencia = 0;   
        if (tipo === 1){
            frecuencia = numerosA.length / k_Intervalos;
            frecuenciaEsperada = Array(k_Intervalos).fill(parseFloat(frecuencia))
        }
        else if (tipo === 2){
            const lambda = 1 / media;
            const intervalo = intervalos[i];
            frecuencia = calcularFrecuenciaEsperadaExponencial(lambda, intervalo.linf, intervalo.lsup, n);
            frecuenciaEsperada.push(parseFloat(frecuencia));
        }
        else {
            const intervalo = intervalos[i];
            frecuencia = calcularFrecuenciaEsperadaNormal(intervalo.linf, intervalo.lsup, media, desviacion, n);
            frecuenciaEsperada.push(parseFloat(frecuencia));
        }
    }

    let intervalosNoAgrupados = [];
    for (let i = 0; i<k_Intervalos; i++) {
        intervalosNoAgrupados.push({
            nroIntervalo: intervalos[i].nroIntervalo,
            linf: intervalos[i].linf.toFixed(4),
            lsup: intervalos[i].lsup.toFixed(4),
            fo: frecuenciaObservada[i],
            fe: frecuenciaEsperada[i].toFixed(1)
        })
    }
    
    const intervaloAgrupado = await agruparIntervalos(frecuenciaObservada,frecuenciaEsperada,intervalos);
    
    /*
    console.log("Intervalos sin agrupar: ", intervalos);
    console.log("FO:", frecuenciaObservada.reduce((total, actual) => total + actual, 0));
    console.log("FE:", frecuenciaEsperada.reduce((total, actual) => total + actual, 0));
    console.log("Intervalos Agrupados: ", intervaloAgrupado);
    */

    let chiCalculado = 0;
    const intervalosResultados = intervaloAgrupado.map((intervalo, index) => {
        const observada = intervalo.sumaFO;
        const esperada = intervalo.sumaFE;
        const terminoChi = parseFloat((Math.pow(observada - esperada, 2) / esperada).toFixed(4));
        chiCalculado += terminoChi;
        return { nroIntervalo: intervalo.nroIntervalo, linf: intervalo.linf.toFixed(4), lsup: intervalo.lsup.toFixed(4), fo: observada, fe: esperada.toFixed(4), terminoChi: terminoChi.toFixed(4), chiAcumulado: chiCalculado.toFixed(4) };
    });   

    /*
    console.log("n:", n);
    console.log("k_Intervalos:", k_Intervalos);
    console.log("max:", max.toFixed(4));
    console.log("min:", min.toFixed(4));
    console.log("rango:", rango.toFixed(4));
    console.log("amplitud:", amplitud.toFixed(4));
    console.log("media:", media.toFixed(4));
    console.log("varianza:", varianza.toFixed(4));
    console.log("desviacion: ", desviacion.toFixed(4));
    console.log("Intervalos:", intervalos);
    console.log("Frecuencia observada:", frecuenciaObservada);
    console.log("Frecuencia esperada:", frecuenciaEsperada);
    console.log("Chi-cuadrado:", chiCalculado.toFixed(4));
    */

    return {
        chiCalcu: chiCalculado.toFixed(4),
        intervalos: intervalosResultados,
        intervalosNoAgrupados: intervalosNoAgrupados
    };
}

function calculoMedia(numerosA){
    const numeros = numerosA.map(numero => parseFloat(numero));
    const suma = numeros.reduce((total, numero) => total + numero, 0);
    const media = suma / numeros.length;
    return parseFloat(media.toFixed(4));
}

function calcularVarianza(numeros, u) {
    let sumaCuadradosDiferencias = 0;
    for (let i = 0; i < numeros.length; i++) {
        const diferencia = numeros[i] - u;
        sumaCuadradosDiferencias += Math.pow(diferencia, 2);
    }
    return parseFloat((sumaCuadradosDiferencias / (numeros.length - 1)).toFixed(4));
}

function encontrarMaximoMinimo(numerosA) {
    if (numerosA.length === 0) {
        return { max: undefined, min: undefined };
    }

    let max = numerosA[0];
    let min = numerosA[0];

    for (let i = 1; i < numerosA.length; i++) {
        if (numerosA[i] > max) {
            max = numerosA[i];
        }
        if (numerosA[i] < min) {
            min = numerosA[i];
        }
    }

    return { max, min };
}

function calcularFrecuenciaEsperadaExponencial(lambda, limInf, limSup, tamanioMuestra) {
    const probabilidadLimInf = 1 - Math.exp(-lambda * limInf);
    const probabilidadLimSup = 1 - Math.exp(-lambda * limSup);
    const probabilidadIntervalo = probabilidadLimSup - probabilidadLimInf;

    const frecuenciaEsperada = probabilidadIntervalo * tamanioMuestra;
    return frecuenciaEsperada.toFixed(4);
}

function calcularFrecuenciaEsperadaNormal(limInf, limSup, media, desviacion, tamanioMuestra) {
    const probabilidadLimSup = jStat.normal.cdf(limSup, media, desviacion);
    const probabilidadLimInf = jStat.normal.cdf(limInf, media, desviacion);
    const probabilidadIntervalo = probabilidadLimSup - probabilidadLimInf;
    const frecuenciaEsperada = probabilidadIntervalo * tamanioMuestra;
    return frecuenciaEsperada.toFixed(4);
}

function agruparIntervalos(frecuenciaObservada, frecuenciaEsperada, intervalos) {
    const intervalosAgrupados = [];
    let inicioIntervalo = 0;
    let sumaFE = 0;
    let sumaFO = 0;
    let nrosIntervalosAgrupados = '';

    for (let i = 0; i < frecuenciaEsperada.length; i++) {
        sumaFE += frecuenciaEsperada[i];
        sumaFO += frecuenciaObservada[i];
        nrosIntervalosAgrupados += `${intervalos[i].nroIntervalo}/`;

        if (sumaFE >= 5 || i === frecuenciaEsperada.length - 1) {
            const finIntervalo = i;
            const intervaloAgrupado = {
                linf: intervalos[inicioIntervalo].linf,
                lsup: intervalos[finIntervalo].lsup,
                nroIntervalo: nrosIntervalosAgrupados.slice(0, -1), 
                sumaFE: sumaFE,
                sumaFO: sumaFO
            };
            intervalosAgrupados.push(intervaloAgrupado);

            inicioIntervalo = finIntervalo + 1;
            sumaFE = 0;
            sumaFO = 0;
            nrosIntervalosAgrupados = '';
        }
    }
    let sumaFEUltimoIntervalo = intervalosAgrupados[intervalosAgrupados.length - 1].sumaFE;

    while (sumaFEUltimoIntervalo < 5 && intervalosAgrupados.length > 1) {
        intervalosAgrupados[intervalosAgrupados.length - 2].nroIntervalo =  `${intervalosAgrupados[intervalosAgrupados.length - 2].nroIntervalo}/` + `${intervalosAgrupados[intervalosAgrupados.length - 1].nroIntervalo}`;
        intervalosAgrupados[intervalosAgrupados.length - 2].sumaFE += sumaFEUltimoIntervalo;
        intervalosAgrupados[intervalosAgrupados.length - 2].sumaFO += intervalosAgrupados[intervalosAgrupados.length - 1].sumaFO
        intervalosAgrupados[intervalosAgrupados.length - 2].lsup = intervalosAgrupados[intervalosAgrupados.length - 1].lsup;
        
        intervalosAgrupados.pop();
        
        sumaFEUltimoIntervalo = intervalosAgrupados[intervalosAgrupados.length - 1].sumaFE;
    }

    return intervalosAgrupados;
}


const pruebaChi = {pruebaCHI};
export default pruebaChi;