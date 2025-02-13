import { BarSeries, Histogram, withParentSize, XAxis, YAxis} from "@data-ui/histogram";
import { useMemo } from "react";
import './Histogram.css';

export function HistogramWrapper({resultIntervals}) {

    console.log(resultIntervals)

    // Definicion de los intervalos y de los ticks a utilizar:
    let binnedData = useMemo(() => resultIntervals.map((interval, i) => {
      return {id: i, bin0: interval.linf, bin1: interval.lsup, count: interval.fo, fe: interval.fe}
    }), [resultIntervals]);
    let tickValues = useMemo(
      () => {
        let result = resultIntervals.map(interval => {return Number(interval.linf).toFixed(4)});
        result.push(resultIntervals[resultIntervals.length-1].lsup)
        return result
    },
    [resultIntervals]
    );

    console.log(tickValues)

    //Creamos un histograma que se adapte en el tamaño
    const ResponsiveHistogram = withParentSize(({ parentWidth, parentHeight, ...rest}) => (
    <Histogram
      width={parentWidth}
      height={400}
      {...rest}
    />
    ));

    return (
      <ResponsiveHistogram
        ariaLabel="My histogram of ..."
        renderTooltip={({ event, datum, data, color }) => (
          <div>
            <strong style={{ color }}>{datum.bin0} a {datum.bin1}</strong>
            <div><strong>Frecuencia observada:  </strong>{datum.count}</div>
            <div><strong>Frecuencia esperada:  </strong>{datum.fe}</div>
            <div><strong>Porcentaje: </strong>{Math.round(datum.density * 100) + "%"}</div>
          </div>
        )}
  
      >
        <BarSeries
          animated={false}
          binnedData={binnedData}
          stroke="#000000"
          fill="#af87ff"
        />
        <XAxis
          tickValues = {tickValues}
          label = "Numero Aleatorio"
          tickFormat = {(tick, tickIndex) => Number(tick).toFixed(2)}
        />
        <YAxis
          label= "Frecuencia Observada"
        />

      </ResponsiveHistogram>
    )


}