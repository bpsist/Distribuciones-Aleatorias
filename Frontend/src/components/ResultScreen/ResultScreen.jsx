import { useState } from 'react';
import { HistogramWrapper } from './Histograma/HistogramWrapper';
import styles from './ResultScreen.module.css';
import generadoresService from '../services/generadoresService';

export default function ResultScreen({results}){

  function handleDownload() {
    generadoresService.descargarResultados();
  }

  return (
    <section className={styles.resultScreen}>
      <header>
        <div className={styles.resultHeader}>Resultados de la generacion</div>
        <div className={styles.actionButtons}>
          <button className={styles.downloadButton} onClick={handleDownload}>Decargar CSV</button>
        </div>
      </header>
      <section className={styles.mainScreen}>
        <HistogramWrapper resultIntervals={results.intervalosNoAgrupados}/>
        <section className={styles.detailScreen}>
          <section className={styles.detailSummary}>
            <div>
              N: {results.intervalos.reduce((acm, current) => acm+ current.fo, 0)}
            </div>
            <div>
              Chi Cuadrado calculado (χ<sup>2</sup>): {results.chiCalcu}
            </div>
          </section>
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th>Intervalo</th>
                <th>Limite Inferior</th>
                <th>Limite Superior</th>
                <th>Frec. Obs.</th>
                <th>Frec. Esp</th>
                <th>[(Fo - Fe)^2 / Fe]</th>
                <th>Chi Acumulado</th>
              </tr>
            </thead>
            <tbody>
                {results.intervalos.map((interval, i) => {
                  return (
                    <tr key={i}>
                      <td>{interval.nroIntervalo}</td>
                      <td>{interval.linf}</td>
                      <td>{interval.lsup}</td>
                      <td>{interval.fo}</td>
                      <td>{interval.fe}</td>
                      <td>{interval.terminoChi}</td>
                      <td>{interval.chiAcumulado}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </section>                     
      </section>
    </section>
  )
}