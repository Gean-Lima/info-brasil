import { Card, Row, Spacer, Text } from "@nextui-org/react"
import { useContext, useState } from "react"
import InputSearch from "../components/inputSearch"
import AppContext from "../context/appContext"
import { splitByComma } from "../utils/helpers"

export default function CNPJ() {
  const context = useContext(AppContext)
  const [ loadingActive, setLoadingActive ] = useState(false)
  const [ cnpjFromUser, setCnpjFromUser ] = useState('')
  const [ listCnpjsObtained, setListCnpjsObtained ] = useState([])

  const validCnpjs = (cnpjs) => new Promise((resolve, reject) => {
    cnpjs = cnpjs.filter((cnpj) => (new RegExp('^([0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2})|[0-9]{14}$', 'gm')).test(cnpj))
    cnpjs = cnpjs.map((cnpj) => cnpj.replaceAll('.', '').replace('/','').replace('-', ''))
    cnpjs.length > 0 ? resolve(cnpjs): reject('Digite apenas CNPJs validos')
  })

  const searchCnpjs = (cnpjs) => {
    return new Promise(async (resolve, reject) => {
      try {
        let responsesCnpjs = (await Promise.all(cnpjs.map((cnpj) => fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`))))
        let dataCnpjs = responsesCnpjs.map(async (responseCnpj) => (await responseCnpj.json()))
        for (let i in dataCnpjs) {
          let data = await dataCnpjs[i]
          dataCnpjs[i] = ( data.message
            ? { error: true, message: data.message, cnpj: cnpjs[i] }
            : data )
        }
        console.log(dataCnpjs)
        resolve(dataCnpjs)
      } catch {
        reject('Não foi possivel obter os dados')
      }
    })
  }

  const createListCnpjs = (cnpjs) => {
    setListCnpjsObtained(cnpjs)
  }

  const verificationAndSearch = () => {
    setLoadingActive(true)

    splitByComma(cnpjFromUser)
      .then(validCnpjs)
      .then(searchCnpjs)
      .then(createListCnpjs)
      .catch((error) => context.setRootModal({ active: true, message: error }))
      .finally(() => setLoadingActive(false))
  }

  const CardCNPJ = ({cnpj}) => {
    return (
      <>
        <Card variant="bordered">
          { cnpj.error
            ? <Card.Body>
                <Text color="error">Erro no { cnpj.cnpj }</Text>
                <Text color="error">{ cnpj.message }</Text>
            </Card.Body>
            : <Card.Body>
                <Text>{ cnpj.cnpj } | {cnpj.razao_social }</Text>
                <Row>
                  <Text weight={'bold'} css={{marginRight: 5}}>Razão social:</Text>
                  <Text>{ cnpj.razao_social }</Text>
                </Row>
                <Row>
                  <Text weight={'bold'} css={{marginRight: 5}}>Porte:</Text>
                  <Text>{ cnpj.porte }</Text>
                </Row>
                <Row>
                  <Text weight={'bold'} css={{marginRight: 5}}>Nome fantasia:</Text>
                  <Text>{ cnpj.nome_fantasia }</Text>
                </Row>
                <Row>
                  <Text weight={'bold'} css={{marginRight: 5}}>Natureza juridica:</Text>
                  <Text>{ cnpj.natureza_juridica }</Text>
                </Row>
                <Row>
                  <Text weight={'bold'} css={{marginRight: 5}}>Município e estado:</Text>
                  <Text>{ cnpj.municipio } - { cnpj.uf }</Text>
                </Row>
                <Row>
                  <Text weight={'bold'} css={{marginRight: 5}}>Bairro:</Text>
                  <Text>{ cnpj.bairro }</Text>
                </Row>
                <Row>
                  <Text weight={'bold'} css={{marginRight: 5}}>Logradouro:</Text>
                  <Text>{ cnpj.logradouro }</Text>
                </Row>
              </Card.Body>
          }
        </Card>
        <Spacer y={1} />
      </>
    )
  }

  return (
    <>
      <Text h2 css={{textAlign:'center'}}>Consulta CNPJ</Text>
      <Spacer y={1} />
      <InputSearch
        placeholder="CNPJs (exemplo: 11.111.111/0001-11, 22.222.222/0001-22)"
        label="Digite um ou mais CNPJs separados por vírgula"
        onChange={(event) => setCnpjFromUser(event.target.value)}
        pressSearch={() => verificationAndSearch()}
        loading={loadingActive} />
      <Spacer y={1} />
      <div>
        { listCnpjsObtained.map((cnpj) => <CardCNPJ cnpj={cnpj} key={cnpj.cnpj} /> ) }
      </div>
    </>
  )
}