import generadorRandoms from "./generadorRandom.js";

function generarDistribucionNormal(n, media, desviacion) {
    let rndsNorm = [];

    for (let i = 0; i < n; i += 2) {
        let rnd1 = generadorRandoms.generarRandom();
        let rnd2 = generadorRandoms.generarRandom();

        let z1 = Math.sqrt(-2*Math.log(1 - rnd1)) * Math.sin(2 * Math.PI * rnd2);
        let z2 = Math.sqrt(-2*Math.log(1 - rnd1)) * Math.cos(2 * Math.PI * rnd2);

        z1 = z1 * desviacion + media;
        z2 = z2 * desviacion + media;

        rndsNorm.push(parseFloat(parseFloat(z1)));
        rndsNorm.push(parseFloat(parseFloat(z2)));
    }

    if (n%2 !== 0) {
        rndsNorm.pop()
    }

    return rndsNorm;
}


const generadorNormal = { generarDistribucionNormal };
export default generadorNormal;

