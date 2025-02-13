async function generarNumeros(cantNum, aleatorios) {
    for (let i = 0; i < cantNum; i++) {
        aleatorios.push(Math.random());
    }
}

function generarRandom() {
    return Math.random();
}

const generadorRandoms = { generarNumeros, generarRandom }
export default generadorRandoms;