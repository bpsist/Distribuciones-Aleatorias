import { useForm } from 'react-hook-form';
import styles from './Menu.module.css'
import { useEffect, useState } from 'react';
import { Fieldset, Select, Input } from '../FormComponents/FormComponents';
import generadoresService from '../services/generadoresService';
import ResultScreen from '../ResultScreen/ResultScreen';

export function Menu() {

  const {register, handleSubmit, watch, formState: {errors, isSubmitting, isSubmitSuccessful}, reset} = useForm({
    defaultValues: {
      n: 1,
      k: 10,
      selectedDistribution: 'uniforme',
      params: {}
    },
    mode: 'onSubmit'
});
  // State variables
  let [results, setResults] = useState(null);

  // Manejadores que van a llamar a distintos servicios con sus respectivos parametros, para la generacion de las variables aleatorias.
  async function handleUniforme(data) {
    let results = await generadoresService.uniforme(data.n, data.k, data.params.limiteInferior, data.params.limiteSuperior)
    setResults(results);

  }
  async function handleExponencial(data) {
    let results = await generadoresService.exponencial(data.n, data.k, data.params.lambda)
    setResults(results);
  }
  async function handleNormal(data) {
    let results = await generadoresService.normal(data.n, data.k, data.params.media, data.params.desviacion)
    setResults(results);
  }

  // Dependiendo del tipo de distribucion seleccionada, mostramos campos distintos y cambiamos el manejador del submit
  let currentlySelectedDistribution = watch('selectedDistribution');
  useEffect(()=> {
    setResults(null);

  }, [currentlySelectedDistribution])

  let parametersFieldset= <></>
  let generationHandler = async () => {};

  switch (currentlySelectedDistribution) {
    case 'uniforme':
      let watchLimiteInferior = watch('params.limiteInferior', Number.NEGATIVE_INFINITY);
      parametersFieldset = (<>
        <Input 
              attributeName={'params.limiteInferior'} 
              label="Limite Inferior: " register={register} 
              validations={{required: {value: true, message: "El limite inferior es requerido."}}}
              type='number' 
              error={errors?.params?.limiteInferior}
              step={0.0001}
              />
        <Input 
              attributeName={'params.limiteSuperior'} 
              label="Limite Superior: " register={register} 
              validations={{required: {value: true, message: "El limite superior es requerido."},
                            validate: (value)=> {
                              return parseFloat(value) > parseFloat(watchLimiteInferior) || ("El LSup debe ser mayor a LInf")}}}
              type='number'
              error={errors?.params?.limiteSuperior}
              step={0.0001} />
      </>)
      generationHandler = handleUniforme
      break;

      case 'exponencial':
        parametersFieldset = (<>
          <Input 
                attributeName={'params.lambda'} 
                label="Lambda (λ): "
                register={register} 
                validations={{
                  required: {value: true, message: "Lambda es Requerido"},
                  min: {value: 0.00000000000001, message: "Lambda no puede ser negativo."}
                }
                }
                type='number'
                error={errors?.params?.lambda}
                step={0.0001} />
        </>)
        generationHandler = handleExponencial
        break;
      case 'normal':
        parametersFieldset = (<>
          <Input 
                attributeName={'params.media'} 
                label="Media (μ): " register={register} 
                validations={{required: {value: true, message: "La media es requerida"}}}
                type='number' 
                error={errors?.params?.media}
                step={0.0001}/>
          <Input 
                attributeName={'params.desviacion'} 
                label="Desviacion (σ): " register={register} 
                validations={{required: {value: true, message: "La desviacion es requerida"}}}
                type='number'
                error={errors?.params?.desviacion}
                step={0.0001}/>
        </>)
        generationHandler = handleNormal
        break;
  }

  async function onSubmit(data) {
    setResults(null);
    await generationHandler(data);
  }

  return (
    <section className={styles.menuContainer}>
      <form onSubmit={handleSubmit(onSubmit)}className={styles.inputMenu}>
        <Fieldset header={'Entradas'}>
              <Input 
                attributeName='n' 
                label='N: ' 
                register={register}
                validations={{required: {value: true, message: "La cantidad de numeros a generar requerid"}, 
                              min: {value: 2, message: "Se debe generar al menos 2 numero aleatorio."},
                              max: {value: 1000000, message: "No se pueden generar mas de 1000000 numeros."}
                              }}
                type='number'
                error={errors.n}
                />
              <Select
                label={"Distribucion: "}
                attributeName={'selectedDistribution'}
                register={register}
                options={[{value: "uniforme", label:"Uniforme U(A,B)" },
                          {value: "exponencial", label:"Exponencial E(λ)"},
                          {value: "normal", label: "Normal N(μ, σ)"}
                        ]}
              />
                <Select
                label={"Cantidad de Intervalos (K): "}
                attributeName={'k'}
                register={register}
                options={[{value: 10, label:"10"},
                          {value: 15, label: "15"},
                          {value: 20, label: "20"},
                          {value: 25, label: "25"}
                        ]}
              />
        </Fieldset>
        <Fieldset header='Parametros'>
          {parametersFieldset}
        </Fieldset>
        <button className={styles.submitButton} type='submit' disabled={isSubmitting}>
          Generar Numeros Aleatorios
        </button>
      </form>
      {isSubmitting && (
        <div className={styles.loadingScreen}>
          <header>Generando aumeros aleatorios...</header>
          <div>Por favor aguarde...</div>
          <div className={styles.loader}/>
        </div>
      )}
      {results && (
        <ResultScreen results={results}/>
      )}
    </section>
  )

}