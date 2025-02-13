async function generarDistribucionUniforme(numA, numB, numerosAleatorios) {
    let variables = [];
    for (let i = 0; i < numerosAleatorios.length; i++) {
        let x = parseInt(numA) + (numerosAleatorios[i] * (numB-numA));
        variables.push(parseFloat(x.toFixed(4)));
    }
    
    return variables;
}

const generadorUniforme = {generarDistribucionUniforme};
export default generadorUniforme;
