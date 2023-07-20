  'use client'
import Button from "@/components/Button";
import Input from "@/components/Input";
import useLocalStorage from "@/hooks/useLocalStorage";
import { setAlert } from "@/redux/alertSlice"
import { useAppDispatch } from "@/redux/hook"
import { setUser } from "@/redux/userSlice";
import apiClient from "@/utils/client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import styled from "styled-components"

export default function Home() {

  const dispatch = useAppDispatch();
  const router = typeof window !== 'undefined' ? useRouter() : null;
  const [valueStorage , setValue] = useLocalStorage("user", "")

  const formik = useFormik({
    initialValues: {
      usuario: '',
      password: ''
    },
    validateOnChange: false,
    onSubmit: (formValue) => {
      apiClient.post('/empleado/login', formValue)
      .then(r=>{
        if (!r.data.data[0].estado) {
          dispatch(setAlert({
            message: 'No tienes permiso para iniciar sesion',
            type: 'error'
          })) 
          return null
        }
        const user = {
          usuario: r.data.data[0].usuario,
          token: r.data.token,
          sucursal: r.data.data[0].sucursal,
          roles: r.data.data[0].roles
        }
        dispatch(setAlert({
          message: 'Ingresado correctamente',
          type: 'success'
        }))
        dispatch(setUser(user))
        setValue(user)
        router.push('/dashboard/productos')
      })
      .catch(e=>
        dispatch(setAlert({
          message: 'Hubo un error, revise los datos',
          type: 'error'
        }))  
      )
        
    }
  })

  if (valueStorage?.token) {
    dispatch(setAlert({
      message: `USUARIO YA LOGEADO ${valueStorage.usuario}`,
      type: 'success'
    }))
    dispatch(setUser(valueStorage))
    return router.push('/dashboard/productos')
  }

  return (
    <Container>
      <ContainerLogin>
        <Logo>OPTICA</Logo>
        <div>
          <Input label={'Usuario'} name={'usuario'} value={formik.values.usuario} onChange={formik.handleChange}/>
          <Input type="password" name={'password'} label={'Contraseña'} value={formik.values.password} onChange={formik.handleChange}/>
        </div>
        <div style={{display: "flex", justifyContent: "center"}} >
          <Button text={'INGRESAR'} onClick={formik.handleSubmit} width="150px"/>
        </div>
      </ContainerLogin>
    </Container>
  )
}

const Container = styled.div `
  padding: 0 15px;
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
