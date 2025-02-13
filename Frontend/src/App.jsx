import styles from './App.module.css'
import '@material-design-icons/font'
import { Menu } from './components/Menu/Menu'

function App() {

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <div className={styles.headerTitle}>
          SIMULACION
        </div>
        <div className={styles.headerDescription}>
          <div>
            Generacion de Variables Aleatorias
          </div>
        </div>

      </header>
      <Menu/>
    </div>
  )
}

export default App
