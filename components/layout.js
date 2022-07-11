import { Container, Grid, Modal, Spacer, Text } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import AppContext from "../context/appContext";

export default function LayoutDefault({children}) {
  const context = useContext(AppContext)

  const closeModal = () => context.setRootModal({active:false, message: ''})

  return (
    <>
      <Container css={{maxWidth: "680px"}}>
        <header>
          <Link href={'/'}>
            <a>
              <h1 style={{textAlign: 'center', textShadow: '0 1px 3px rgba(0, 0, 0, .3)'}}>
                <span style={{color: '#F6D800'}}>Info</span>
                <span style={{color: '#009638'}}>Brasil</span>
              </h1>
            </a>
          </Link>
        </header>
        <Spacer y={2} />
        <div style={{minHeight: 360}}>
          {children}
        </div>
        <Spacer y={2} />
        <footer>
          <Grid.Container justify="center" alignItems="center">
            <Grid css={{marginRight: 10}}>
              <Link href={'https://vercel.com/'}>
                <a target="_blank">
                  <Image src="/vercel-logo.png" width={147} height={32} alt="Logo Vercel"/>
                </a>
              </Link>
            </Grid>
            <Grid css={{marginRight: 10}}>
              <Link href={'https://nextjs.org/'}>
                <a target="_blank">
                  <Image src="/nextjs-logo.png" width={78} height={32} alt="Logo Brasil API" />
                </a>
              </Link>
            </Grid>
            <Grid>
              <Link href={'https://brasilapi.com.br/'}>
                <a target="_blank">
                  <Image src="/brasilapi-logo.webp" width={147} height={32} alt="Logo Brasil API" />
                </a>
              </Link>
            </Grid>
          </Grid.Container>
          <p></p>
        </footer>
      </Container>
      <Modal blur open={context.state.rootModal.active} onClose={closeModal}>
        <Modal.Body>
          <Text>{context.state.rootModal.message}</Text>
        </Modal.Body>
      </Modal>
    </>
  )
}