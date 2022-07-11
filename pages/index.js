import { Card, Grid, Text } from "@nextui-org/react"
import { IoArrowForward } from 'react-icons/io5'
import Link from 'next/link'

export default function Home() {
  const CardLink = ({title, link, children}) => {
    return (
      <Link href={link}>
        <a style={{display: 'block', width: '100%'}}>
          <Card 
            isHoverable
            isPressable
            variant="bordered">
            <Card.Body>
              <Grid.Container alignItems="center" justify="space-between">
                <Grid>
                  <h2 style={{fontSize: '1.4rem', color: '#002672'}}>{ title }</h2>
                </Grid>
                <Grid>
                  <IoArrowForward fontSize="1.6rem" color="#002672" />
                </Grid>
              </Grid.Container>
              
              <Text css={{fontWeight: '300'}}>{ children }</Text>
            </Card.Body>
          </Card>
        </a>
      </Link>
    )
  }

  return (
    <Grid.Container gap={2} alignItems="center" justify="center">
      <Grid xs={6}>
        <CardLink title="CEP" link="/cep">
          Informações referentes a CEPs.
        </CardLink>
      </Grid>
      <Grid xs={6}>
        <CardLink title="CNPJ" link="/cnpj">
          Busca dados de empresas por CNPJ.
        </CardLink>
      </Grid>
      <Grid xs={6}>
        <CardLink title="DDD" link="/ddd">
          Informações relacionadas a DDDs.
        </CardLink>
      </Grid>
      <Grid xs={6}>
        <CardLink title="BANKS" link="/banks">
          Informações sobre sistema bancário.
        </CardLink>
      </Grid>
      <Grid xs={6}>
        <CardLink title="IBGE" link="/ibge">
          Informações sobre estados Provenientes do IBGE.
        </CardLink>
      </Grid>
      <Grid xs={6}>
        <CardLink title="FIPE" link="/fipe">
          Informações sobre Preço Médio de Veículos fornecido pela FIPE.
        </CardLink>
      </Grid>
    </Grid.Container>
  )
}
