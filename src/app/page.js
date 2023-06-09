  'use client'
import Button from "@/components/Button"
import Input from "@/components/Input"
import { setAlert } from "@/redux/alertSlice"
import { useAppDispatch } from "@/redux/hook"
import styled from "styled-components"

export default function Home() {

  const dispatch = useAppDispatch();

  return (
    <Container>
      <ContainerLogin>
        <Logo>OPTICA</Logo>
        <div>
          <Input label={'Usuario'}/>
          <Input type="password" label={'Contraseña'}/>
        </div>
        <div style={{display: "flex", justifyContent: "center"}} >
          <Button text={'INGRESAR'} onClick={()=>{
            dispatch(setAlert({
              message: 'Ingresado correctamente',
              type: 'success'
            }))
          }} width="150px" to={'/dashboard/productos'}/>
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
  padding: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const Logo = styled.h2 `
  color: #8294C4;
  text-align: center;
  margin: 15px 0;
  font-size: 40px;
`
