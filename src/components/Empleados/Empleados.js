import React, { useEffect, useState } from 'react'
import InputSearch from '../InputSearch'
import Button from '../Button'
import styled, { keyframes } from 'styled-components'
import NewEditEmpleado from './NewEditEmpleado'
const io = require('socket.io-client')
import apiClient from '@/utils/client'
import Loading from '../Loading'
import EmptyList from '../EmptyList'
import { getUser } from '@/redux/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import { useInputValue } from '@/hooks/useInputValue'
import { useSearch } from '@/hooks/useSearch'

export default function Empleados() {

    const [openNewEdit, setOpenNewEdit] = useState(false)
    const [selected, setSelected] = useState(undefined)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const user = useAppSelector(getUser);
    const dispatch = useAppDispatch();
    const search = useInputValue('','')

    const tag = ["nombreCompleto"]

    const listEmpleados = useSearch(search.value, tag, data)

    useEffect(()=>{
      setLoading(true)
      apiClient.get(`/empleado` ,
      {
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
          .then(r=>{
            setData(r.data.body)
            setLoading(false)
          })
          .catch(e=>dispatch(setAlert({
            message: 'Hubo un error inesperado al cargar los empleados',
            type: 'error'
          })))
    },[])

    useEffect(()=>{
      console.log(data)
      const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
      socket.on('empleado', (empleado) => {
        console.log("algo en empleado",empleado)
        setData((prevData)=>{
          const exist = prevData.find(elem => elem._id === empleado.res._id )
          if (exist) {
            return prevData.map((item) =>
            item._id === empleado.res._id ? empleado.res : item
          )
          }
          return [...prevData, empleado.res]
        })
      })
      return () => {
        socket.disconnect();
      }; 
    },[data])

    useEffect(()=>{
      if (openNewEdit) {
        user.roles.permisos.forEach((permiso) => {
          if (permiso.screen.toLowerCase() === 'gestion') {
            if (!permiso.escritura) {
              dispatch(setAlert({
                message: 'NO TIENES PERMISOS DE USUARIO',
                type: 'error'
              }))
              setOpenNewEdit(false)
            }
          }
        });
      }
    },[openNewEdit])

  return (
    <Container>
      {
        loading ?
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Loading/>
          </div> 
        :
        <>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <InputSearch placeholder={'Buscar Empleado'} {...search} />
            <Button text={'NUEVO'} onClick={()=>{
                setSelected(undefined)
                setOpenNewEdit(true)
              }} />
          </div> 
          {
            openNewEdit ? 
            <AnimatedContainer1>
              <NewEditEmpleado handleClose={()=>setOpenNewEdit(false)} item={selected} token={user.token} />
            </AnimatedContainer1>
            :
            <AnimatedContainer2>
              <List>
                  {
                    listEmpleados.length === 0 ?
                    <EmptyList onClick={() => setOpenNewEdit(true)} />
                    :
                    listEmpleados.map((item,index)=>(
                        <Item key={index} onClick={()=>{
                          setSelected(item) 
                          setOpenNewEdit(true) 
                        }} >
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}} >
                                <label style={{fontSize: 18, fontWeight: 500, color: `${process.env.TEXT_COLOR}`}}>{item.nombreCompleto}</label>
                                <label style={{fontSize: 16, fontWeight: 400, color: `${process.env.TEXT_COLOR}`}}>{item.sucursal}</label>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}} >
                                <label style={{fontSize: 16, fontWeight: 400, color: `${process.env.TEXT_COLOR}`}}>{item.direccion}</label>
                                <label style={{fontSize: 16, fontWeight: 400, color: `${process.env.TEXT_COLOR}`}}>{item.telefono}</label>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}} >
                              <label style={{fontSize: 16, fontWeight: 400, color: `${process.env.TEXT_COLOR}`}}>{item.rol}</label>
                                <label style={{fontSize: 16, fontWeight: 400, color: `${process.env.TEXT_COLOR}`}}>{item.estado ? 'ACTIVO' : 'NO ACTIVO'}</label>
                            </div>
                        </Item>
                    ))
                  }
              </List>
            </AnimatedContainer2>
          }
        </>
      }
    </Container>
  )
}

const Container = styled.div `
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  padding: 25px;
  @media only screen and (max-width: 445px) {
    padding: 5px;
  }
`
const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  overflow-y: scroll;
`

const Item = styled.li `
  padding: 15px;
  list-style: none;
  cursor: pointer;
  :hover{
      background-color: #F9F5F6;
  };
  @media only screen and (max-width: 445px) {
    padding: 5px;
  }
`

const fadeAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const AnimatedContainer1 = styled.div`
  animation: ${fadeAnimation} 0.5s ease-in-out;
`;

const AnimatedContainer2 = styled.div`
  animation: ${fadeAnimation} 0.5s ease-in-out;
`;



