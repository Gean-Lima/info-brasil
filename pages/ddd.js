import { useContext, useState } from 'react';
import InputSearch from '../components/inputSearch';
import { Card, Collapse, Row, Spacer, Text } from "@nextui-org/react";
import { splitByComma } from '../utils/helpers';
import AppContext from '../context/appContext';

export default function DDD() {
  const context = useContext(AppContext)
  const [ dddFromUser, setDDDFromUser ] = useState('');
  const [ loadingActive, setLoadingActive ] = useState(false);
  const [ listDDDsObtained, setListDDDsObtained ] = useState([]);

  const validDDDs = (ddds) => new Promise((resolve, reject) => {
    ddds = ddds.filter((ddd) => new RegExp('^[1-9]{2}$', 'gm').test(ddd))
    ddds.length > 0 ? resolve(ddds) : reject('Digite apenas DDDs validos')
  })

  const searchDDDs = (ddds) => {
    return new Promise(async (resolve, reject) => {
      try {
        let responsesDDDs = (await Promise.all(ddds.map((ddd) => fetch(`https://brasilapi.com.br/api/ddd/v1/${ddd}`))))
        let dataDDDs = responsesDDDs.map(async (responseDDD) => (await responseDDD.json()))
        for (let i in dataDDDs) {
          let data = await dataDDDs[i]
          dataDDDs[i] = ( data.message
            ? { ddd: ddds[i], message: data.message, error: true }
            : {...data, ddd: ddds[i]} )
        }
        resolve(dataDDDs)
      } catch {
        reject('Não foi possivel obter os dados')
      }
    })
  }

  const verificationAndSearch = () => {
    setLoadingActive(true);

    splitByComma(dddFromUser)
      .then(validDDDs)
      .then(searchDDDs)
      .then((ddds => setListDDDsObtained(ddds)))
      .catch((error) => context.setRootModal({ active: true, message: error }))
      .finally(() => setLoadingActive(false))
  }

  const CardDDD = ({ddd}) => {
    return (
      <>
        <Card variant='bordered'>
          <Card.Body>
            <Text>DDD {ddd.ddd}</Text>
            <Row>
              <Text weight={'bold'} css={{marginRight: 5}}>Estado:</Text>
              <Text>{ddd.state}</Text>
            </Row>
            <Collapse.Group>
              <Collapse title="Cidades">
                <ul>
                  { ddd.cities.map((city) => <li key={city}>{city}</li>) }
                </ul>
              </Collapse>
            </Collapse.Group>
          </Card.Body>
        </Card>
        <Spacer y={1} />
      </>
    )
  }

  return (
    <>
      <Text h2 css={{textAlign:'center'}}>Consulta DDD</Text>
      <Spacer y={1} />
      <InputSearch
          placeholder="DDDs (exemplo: 88, 11)"
          label="Digite um ou mais DDDs separados por vírgula"
          onChange={(event) => setDDDFromUser(event.target.value)}
          pressSearch={() => verificationAndSearch()}
          loading={loadingActive} />
      <Spacer y={1} />
      <div>
        { listDDDsObtained.map((ddd) => <CardDDD ddd={ddd} key={ddd.ddd} />) }
      </div>
    </>
  )
}