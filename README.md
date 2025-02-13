# Aplicación Web para Manejo de Variables Aleatorias con Diferentes Distribuciones

## Introducción

Esta aplicación permite generar variables aleatorias a partir de distintas distribuciones (Uniforme, Exponencial, Normal) y realizar análisis estadísticos sobre ellas. Permite  ingresar parámetros específicos para generar muestras de variables aleatorias, visualizar los resultados y realizar un análisis de frecuencias junto con la prueba estadística de Ji Cuadrado.

## Enunciado
Crear un aplicativo que genere una serie de números aleatorios (4 dígitos decimales)
de variables aleatorias para las siguientes distribuciones: uniforme [a, b], exponencial y normal.

- Para generar el número aleatorio uniforme continuo entre 0 y 1, utilizar la función nativa del lenguaje.
- El usuario deberá poder ingresar el tamaño de muestra deseado (hasta 1.000.000) y los parámetros requeridos según la distribución seleccionada.
- La serie de números generada debe poder ser visualizada.
- Sobre esta serie se debe realizar el histograma de frecuencias para 10, 15, 20 ó 25 intervalos (a seleccionar), donde se muestren las frecuencias observadas. El gráfico debe tener todos los rótulos en los ejes, límites de los intervalos, frecuencia, etc.
- Se debe mostrar la tabla de frecuencias.
- Para la serie generada, se debe calcular Ji Cuadrado para la misma cantidad de intervalos seleccionados por el usuario para hacer el histograma (excepto si se tienen que juntar intervalos de acuerdo al método visto en clase). Se debe mostrar esta tabla y el Ji Cuadrado calculado.

## Tecnologías Utilizadas
- Frontend: React y Vite
- Backend: Node.js, libreria Axios y uso de CORS.

NOTA: Aplicación realizada en 2024.
