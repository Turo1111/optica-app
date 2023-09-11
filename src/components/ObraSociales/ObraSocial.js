import React, { useEffect, useState } from 'react'
import InputSearch from '../InputSearch'
import Button from '../Button'
import Table from '../Table'
import NewEditObraSocial from './NewEditObraSocial'
import apiClient from '@/utils/client'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import Loading from '../Loading'
import styled, { keyframes } from 'styled-components'
import { getUser } from '@/redux/userSlice'
import { useInputValue } from '@/hooks/useInputValue'
import { useSearch } from '@/hooks/useSearch'
const io = require('socket.io-client')

export default function ObraSocial() {

  const dispatch = useAppDispatch();

    const [openNewEdit, setOpenNewEdit] = useState(false)
    const [selected, setSelected] = useState(null)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const user = useAppSelector(getUser);
    const search = useInputValue('','')

    const tag = ["descripcion"]

    const listObras = useSearch(search.value, tag, data)

    function getOBS() {
      setLoading(true)
      apiClient.get('/obrasocial' ,
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
        message: `${e.response.data.error || 'Ocurrio un error'}`,
        type: 'error'
      })))
    }

    useEffect(()=>{
      getOBS()
    },[user.token])

    useEffect(()=>{
      
      const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
      socket.on('obraSocial', (obraSocial) => {
        setLoading(true)
        setData((prevData)=>{
          const exist = prevData.find(elem => elem._id === obraSocial.res._id )
          setLoading(false)
          if (exist) {
            return prevData.map((item) =>
            item._id === obraSocial.res._id ? obraSocial.res : item
          )
          }
          return [...prevData, obraSocial.res]
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
            <InputSearch placeholder={'Buscar Obra Social'} {...search} />
            <Button text={'NUEVO'} onClick={()=>{
                /* setSelected(null) */
                setOpenNewEdit(true)
              }} />
          </div> 
          {
            openNewEdit ? 
            <AnimatedContainer1>
              <NewEditObraSocial handleClose={()=>{
                  setSelected(null)
                  setOpenNewEdit(false) 
              }} 
              item={selected} edit={selected && true} 
              token={user.token}
              />
            </AnimatedContainer1>
            :
            <AnimatedContainer2>
              <Table data={listObras} columns={columns} maxHeight={false} onClick={(item)=>{
                  setSelected(item)
                  setOpenNewEdit(true)
              }} 
              />
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

const columns = [
    { label: 'Obra social', field: 'descripcion', width: '30%' },
    { label: 'Descuento', field: 'cantidadDescuento', width: '20%', align: 'center' },
    { label: 'Devolucion', field: 'cantidadDevuelta', width: '20%', align: 'center' },
];

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
