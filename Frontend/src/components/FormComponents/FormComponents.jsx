import styles from './FormComponents.module.css'

export function Fieldset ({header, children}) {
  return (
  <fieldset>
    <header className={styles.fieldsetHeader}>
        {header}
    </header>
  <div className={styles.fieldsetInputs}>
    {children}
  </div>
  </fieldset>
  )
}

export function Input({label, type, attributeName, register, validations, error, step=1}) {

  return (
      <>
        <div className={styles.labelInput}>
          <label htmlFor={attributeName}>{label}</label>
          <input id={attributeName}
                 step={step}
                   type={type} {...register(attributeName, validations)}
                   />
          
        </div>
        {(error) && <div className={styles.inputError}>{error.message}</div>}

      </>
  )
}

export function Select({label, attributeName, options, register}) {
  /*options: [
          {
              value
              label
          }
      ]
  */
  return (
  
    <div className={styles.labelSelect}>
      <label htmlFor={attributeName}>{label}</label>
      <select {...register(attributeName)}>
          {options.map((o) => {
              return (
                  <option key={o.value} value={o.value}>{o.label}</option>
              )
          })}
      </select>
    </div>
  )
}