import { Card, Grid, Loading, Modal, Row, Spacer, Text } from "@nextui-org/react"
import { useContext, useState } from "react"
import InputSearch from "../components/inputSearch"
import AppContext from "../context/appContext"
import { splitByComma } from "../utils/helpers"

export default function CEP() {
  const context = useContext(AppContext)
  const [ cepsFromUser, setCepsFromUser ] = useState('')
  const [ loadingActive, setLoadingActive ] = useState(false)
  const [ listCepsObtained, setListCepsObtained ] = useState([])

  const validCeps = (ceps) => new Promise((resolve, reject) => {
    ceps = ceps.filter((cep) => (new RegExp('^([0-9]{5}-[0-9]{3})|[0-9]{8}$', 'gm')).test(cep))
    ceps = ceps.map((cep) => cep.replace('-', ''))
    ceps.length > 0 ? resolve(ceps): reject('Digite apenas CEPs validos')
  })

  const searchCeps = (ceps) => {
    return new Promise(async (resolve, reject) => {
      try {
        let responsesCEPs = (await Promise.all(ceps.map((cep) => fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`))))
        let dataCEPs = responsesCEPs.map(async (responseCep) => (await responseCep.json()))
        for (let i in dataCEPs) {
          let data = await dataCEPs[i]
          dataCEPs[i] = ( data.message
            ? { cep: ceps[i], message: data.message, error: true }
            : data )
        }
        resolve(dataCEPs)
      } catch {
        reject('Não foi possivel obter os dados')
      }
    })
  }

  const createListCeps = (ceps) => {
    setListCepsObtained(ceps)
  }

  const verificationAndSearch = () => {
    setLoadingActive(true)

    splitByComma(cepsFromUser)
      .then(validCeps)
      .then(searchCeps)
      .then(createListCeps)
      .catch((error) => context.setRootModal({ active: true, message: error }))
      .finally(() => setLoadingActive(false))
  }

  const CardCEP = ({ cep }) => {
    return (
      <>
        <Card variant="bordered">
          { cep.error 
            ? <Card.Body>
                <Text color="error">Erro no cep { cep.cep }</Text>
                <Text color="error">{ cep.message }</Text>
              </Card.Body>
            : <Card.Body>
              <Text>{ cep.cep } | { cep.city } - { cep.state }</Text>
              { cep.neighborhood && <Row>
                <Text
                  weight={'bold'}
                  css={{marginRight: 5}}>Bairro:</Text>
                <Text>{ cep.neighborhood }</Text>
              </Row> }
              { cep.street && <Row>
                <Text
                  weight={'bold'}
                  css={{marginRight: 5}}>Rua:</Text>
                <Text>{ cep.street }</Text>
              </Row> }
              <Row>
                <Text
                  weight={'bold'}
                  css={{marginRight: 5}}>Serviço:</Text>
                <Text>{ cep.service }</Text>
              </Row>
            </Card.Body>
          }
        </Card>
        <Spacer y={0.5} />
      </>
    )
  }

  return (
    <>
      <Text h2 css={{textAlign:'center'}}>Consulta CEP</Text>
      <Spacer y={1} />
      <InputSearch
        placeholder="CEPs (exemplo: 11111-000, 22222-000)"
        label="Digite um ou mais CEPs separados por vírgula"
        onChange={(event) => setCepsFromUser(event.target.value)}
        pressSearch={() => verificationAndSearch()}
        loading={loadingActive} />
      <Spacer y={1} />
      <div>
        { listCepsObtained.map((cep) => {
          return <CardCEP cep={cep} key={cep.cep} />
         })}
      </div>
    </>
  )
}