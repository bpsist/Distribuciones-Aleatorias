async function generarDistribucionExponencial(lambda, rnds) {
    let rndsExp = [];
    for (let i = 0; i < rnds.length; i++) {
        let rndExp = getRandomExponencial(rnds[i], lambda);
        rndsExp.push(parseFloat(rndExp));
    }    
    return rndsExp;
}

function getRandomExponencial(rnd, lambda) {
    return (-1/lambda) * Math.log(1 - rnd)
}

const generadorExponencial = { generarDistribucionExponencial };
export default generadorExponencial;