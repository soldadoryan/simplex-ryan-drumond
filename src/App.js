import { useState } from 'react'
import Global, * as S from './styles'
import { toast } from 'react-toastify';

function App() {
  const [valueForm, setValueForm] = useState('')
  const [values, setValues] = useState([
    ['1', '2', '0', '0', '0', '0'],
    ['-8', '-2', '1', '0', '0', '-16'],
    ['-1', '-1', '0', '1', '0', '-6'],
    ['-2', '-7', '0', '0', '1', '-28'],
  ])
  const [linhaTermoIndependente, setLinhaTermoIndependente] = useState('')
  const [menorValorModularFuncObj, setMenorValorModularFuncObj] = useState('')
  const [labels, setLabels] = useState(['a', 'b', 'c', 'd', 'e', 'f'])
  const [stepMinimizacao, setStepMinimizacao] = useState(0)
  const [stepMaximizacao, setStepMaximizacao] = useState(0)
  const [colunaMenorValorFuncObjetiva, setColunaMenorValorFuncObjetiva] = useState('')
  const [type, setType] = useState('')
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n']

  const handleSubmit = (e) => {
    e.preventDefault()
    setValues(oldValue => {
      let newSchema = oldValue
      if (oldValue.length === 0) {
        newSchema.push([])
      }
      const lastIndexRow = newSchema.length - 1
      if (newSchema[lastIndexRow].length === labels.length) {
        setLabels(oldLabels => [...oldLabels, letters[newSchema[lastIndexRow].length - 1]])
      }
      newSchema[lastIndexRow].push(valueForm)
      return newSchema
    })
    setValueForm('')
  }

  const handleCreateNewLine = () => {
    setValues(oldValue => [...oldValue, []])
  }

  // Encontrar na linha de funcao objetiva o menor valor
  const maxStep1 = () => {
    setType('Maximização')
    let minValue = 0
    let indexMinValue
    values[0].map((column, indexColumn) => {
      if (+column < minValue && +column < 0) {
        minValue = column
        indexMinValue = indexColumn
      }
    })
    setColunaMenorValorFuncObjetiva(indexMinValue)
    setStepMaximizacao(1)
  }

  // Dividir os elementos do termo independente (ultima coluna) pelos itens da coluna do menor da func objetiva
  const maxStep2 = () => {
    let newValues = values.map((row, indexRow) => {
      if (indexRow === 0) return row
      return row.map((column, indexColumn) => {
        console.log(indexColumn === row.length - 1)
        if (indexColumn === row.length - 1) {
          console.log(+column / +row[colunaMenorValorFuncObjetiva])
          return +column / +row[colunaMenorValorFuncObjetiva]
        }
        return +column
      })
    })

    setValues(newValues)
    setStepMaximizacao(2)
  }

  // selecionar a linha do termo independente menor positivo
  const maxStep3 = () => {
    let minValue = Number.MAX_VALUE
    let indexMinValue
    values.map((row, indexRow) => {
      if (row[row.length - 1] > 0 && row[row.length - 1] < minValue) {
        minValue = row[row.length - 1]
        indexMinValue = indexRow
      }
    })
    setLinhaTermoIndependente(indexMinValue)
    setStepMaximizacao(3)
  }

  // aplicar gauss
  const maxStep4 = () => {
    let newValues = values
    let pivo = newValues[linhaTermoIndependente][colunaMenorValorFuncObjetiva]
    if (pivo === 1) {
      gauss(newValues, colunaMenorValorFuncObjetiva)
    } else {
      const novaLinhaPivo = newValues[linhaTermoIndependente].map((column, indexColumn) => {
        return column / pivo
      })

      newValues = newValues.map((row, indexRow) => {
        if (indexRow === linhaTermoIndependente) return novaLinhaPivo
        return row
      })

      setValues(gauss(newValues, colunaMenorValorFuncObjetiva))
      setStepMaximizacao(4)
    }
  }

  // verificar se existe valor negativo na funcao objetiva
  const maxStep5 = () => {
    let menorQueZero = false
    values[0].map((column) => {
      if (column < 0) menorQueZero = true
    })

    if (menorQueZero) {
      toast.success('Você ainda não encontrou o resultado!')
      setStepMaximizacao(0)
      setType('')
      setColunaMenorValorFuncObjetiva('')
      setLinhaTermoIndependente('')
    } else {
      toast.success('Maximização finalizada!')
    }
  }

  // encontrar a linha do menor valor da coluna do termo independente
  const minStep1 = () => {
    setType('Minimização')
    setMenorValorModularFuncObj('')
    let minValue = 0
    let indexMinValue
    values.map((row, indexRow) => {
      const rowValue = row[row.length - 1]
      if (+rowValue < minValue && +rowValue < 0) {
        minValue = rowValue
        indexMinValue = indexRow
      }
    })
    setLinhaTermoIndependente(indexMinValue)
    setStepMinimizacao(1)
  }

  // Dividir a linha da func objetiva pela linha do menor termo indep
  const minStep2 = () => {
    const novaLinhaFuncObjetiva = values[0].map((columnObj, indexColumnObj) => {
      if (+values[linhaTermoIndependente][indexColumnObj] === 0) return 0
      return (+columnObj / +values[linhaTermoIndependente][indexColumnObj]).toFixed(2)
    })

    const novaMatriz = values.map((row, indexRow) => {
      if (indexRow === 0) {
        return novaLinhaFuncObjetiva
      } else {
        return row
      }
    })

    setValues(novaMatriz)
    setStepMinimizacao(2)
  }

  // verificar o menor valor modular da função objetiva
  const minStep3 = () => {
    let minValue = Number.MAX_VALUE
    let indexMinValue
    values[0].map((column, columnIndex) => {
      const modularColumn = column < 0 ? column * -1 : column
      if (modularColumn > 0) {

        if (modularColumn < minValue) {
          minValue = modularColumn
          indexMinValue = columnIndex
        }
      }
    })

    setMenorValorModularFuncObj(indexMinValue)
    setStepMinimizacao(3)
  }

  // aplicar gauss
  const minStep4 = () => {
    let newValues = values
    let pivo = newValues[linhaTermoIndependente][menorValorModularFuncObj]
    if (pivo === 1) {
      gauss(newValues, menorValorModularFuncObj)
    } else {
      const novaLinhaPivo = newValues[linhaTermoIndependente].map((column, indexColumn) => {
        return column / pivo
      })

      newValues = newValues.map((row, indexRow) => {
        if (indexRow === linhaTermoIndependente) return novaLinhaPivo
        return row
      })

      setValues(gauss(newValues, menorValorModularFuncObj))
      setStepMinimizacao(4)
    }
  }

  const gauss = (newValues, menorValor) => {
    return newValues.map((row, indexRow) => {
      if (indexRow !== linhaTermoIndependente) {
        const coeficiente = row[menorValor]
        return row.map((column, indexColumn) => {
          return +column - coeficiente * newValues[linhaTermoIndependente][indexColumn]
        })
      }
      return row
    })
  }

  const minStep5 = () => {
    let menorQueZero = false
    values.map((row) => {
      if (row[row.length - 1] < 0) menorQueZero = true
    })

    if (menorQueZero) {
      toast.warn('Você ainda não encontrou o resultado!')
      setStepMinimizacao(0)
      menorValorModularFuncObj('')
      setType('')
      linhaTermoIndependente('')
    } else {
      toast.success('Minimização finalizada!')
    }
  }

  const minimizacaoSteps = [
    minStep1,
    minStep2,
    minStep3,
    minStep4,
    minStep5
  ]

  const maximizacaoSteps = [
    maxStep1,
    maxStep2,
    maxStep3,
    maxStep4,
    maxStep5
  ]

  const getColumnClass = (row, column) => {
    if (row === 0) return 'objetiva'
    else {
      if (column === menorValorModularFuncObj && row === linhaTermoIndependente || column === colunaMenorValorFuncObjetiva && row === linhaTermoIndependente) {
        return 'menorvalor'
      }
    }
    if (row === linhaTermoIndependente) {
      return 'linhapivo'
    }
    if (column === colunaMenorValorFuncObjetiva) {
      return 'linhapivo'
    }
    if (column === menorValorModularFuncObj) {
      return 'linhapivo'
    }
    return ''
  }

  return (
    <>
      <Global />
      <S.Container>
        <h2>Simplex {type}: </h2>
        <S.Table>
          <S.Row>
            {labels.map(label => <S.Column>{label}</S.Column>)}
          </S.Row>
          {values.map((row, indexRow) => (
            <S.Row>
              {row.map((column, indexColumn) => <S.Column className={getColumnClass(indexRow, indexColumn)}>{(+column).toFixed(2)}</S.Column>)}
            </S.Row>
          ))}
        </S.Table>
        <S.Form onSubmit={handleSubmit}>
          <S.Input placeholder="Digite um número" value={valueForm} onChange={e => setValueForm(e.target.value)} required />
          <S.ButtonAddNumber type="submit">Adicionar</S.ButtonAddNumber>
          <S.ButtonChangeLine type="button" onClick={handleCreateNewLine}>Nova linha</S.ButtonChangeLine>
          <div></div>
          <div></div>
          <div></div>
          <S.ButtonRun type="button" onClick={minimizacaoSteps[stepMinimizacao]}>Minimização</S.ButtonRun>
          <S.ButtonRun type="button" onClick={maximizacaoSteps[stepMaximizacao]}>Maximização</S.ButtonRun>
        </S.Form>
      </S.Container>
    </>
  );
}

export default App;
