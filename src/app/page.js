  'use client'
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useState } from "react"
import styled from "styled-components"

export default function Home() {

  const [open, setOpen] = useState(false)

  return (
    <Container>
      <ContainerLogin>
        <Logo>OPTICA</Logo>
        <div style={{}} >
          <Input label={'Usuario'}/>
          <Input type="password" label={'Contraseña'}/>
        </div>
        <div style={{display: "flex", justifyContent: "center"}} >
          <Button text={'INGRESAR'} onClick={()=>console.log("ingresar")} width="150px" to={'/productos'}/>
        </div>
      </ContainerLogin>
    </Container>
  )
}

const Container = styled.div `
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: radial-gradient(circle at 50% -20.71%, #00ffff 0, #21e0ff 25%, #3cb5f2 50%, #408cbb 75%, #3b6788 100%);
`

const ContainerLogin = styled.div `
  width: 350px;
  background-color: #F9F5F6;
  border-radius: 15px;
  padding: 15px 0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const Logo = styled.h2 `
  color: #8294C4;
  text-align: center;
  margin: 15px 0;
  font-size: 40px;
`
