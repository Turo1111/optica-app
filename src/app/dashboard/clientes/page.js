'use client'
import Button from '@/components/Button'
import InfoCliente from '@/components/Clientes/InfoCliente'
import ItemCliente from '@/components/Clientes/ItemCliente'
import NewEditCliente from '@/components/Clientes/NewEditCliente'
import NewSenia from '@/components/Clientes/NewSenia'
import EmptyList from '@/components/EmptyList'
import InputSearch from '@/components/InputSearch'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import { useInputValue } from '@/hooks/useInputValue'
import { useSearch } from '@/hooks/useSearch'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { getUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
const io = require('socket.io-client')

export default function Clientes() {

  const [clientSelected, setClientSelected] = useState(undefined)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const user = useAppSelector(getUser);
  const [permission, setPermission] = useState(false)
  const dispatch = useAppDispatch();
  const search = useInputValue('','')
  const [openNewEdit, setOpenNewEdit] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)
  const [openNewSenia, setOpenNewSenia] = useState(false)

  const tag = ["nombreCompleto", "telefono", "dni"]

  const listCliente = useSearch(search.value, tag, data)   

  useEffect(()=>{
    if (user.usuario !== '') {  
      user.roles.permisos.forEach((permiso) => {
          if (permiso.screen.toLowerCase() === 'cliente') {
            if (!permiso.lectura) {
              return setPermission(false)
            }
            return setPermission(true)
          }
      });
    }
  },[user])

  useEffect(()=>{
    if (user.usuario !== '') {
      user.roles.permisos.forEach((permiso) => {
        if (permiso.screen.toLowerCase() === 'cliente') {
          if (!permiso.escritura) {
            dispatch(setAlert({
              message: 'NO TIENES PERMISOS DE USUARIO',
              type: 'error'
            }))
          }
        }
      });
    }
  },[openNewEdit])

  useEffect(() => {
    setLoading(true)
    if (user.token) {
      apiClient.get('/cliente',
      {
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
        .then(r => {
          setData((prevData)=>{
            setLoading(false)
            return r.data.body
          })
        })
        .catch(e => console.log(e))
    }
  }, [])

  useEffect(()=>{
    const socket = io('https://optica-api.onrender.com')
    socket.on('cliente', (cliente) => {
      setData((prevData)=>{
        const exist = prevData.find(elem => elem._id === cliente.res._id )
        if (exist) {
          return prevData.map((item) =>
          item._id === cliente.res._id ? cliente.res : item
        )
        }
        return [...prevData, cliente.res]
      })
    })
    return () => {
      socket.disconnect();
    }; 
  },[data])

  const handleOpenEditModal = (item) => {
    setClientSelected(prevData => {
      setOpenNewEdit(true)
      return item
    })
  }

  const handleOpenInfoModal = (item) => {
    setClientSelected(prevData => {
      setOpenInfo(true)
      return item
    })
  }

  const handleOpenSeniaModal = (item) => {
    setClientSelected(prevData => {
      setOpenNewSenia(true)
      return item
    })
  }

  if (!permission) {
    return <h2>no tiene permisos</h2>
  }

  return (
    <>
          {
            loading ? 
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Loading/>
            </div> 
            :
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <InputSearch placeholder={'Buscar Clientes'} {...search} />
                <Button text={'NUEVO'} onClick={() => {
                  setOpenNewEdit(true)
                  setClientSelected(undefined)
                }} />
              </div>
              <List>
                {
                  listCliente.length === 0 ?
                  <EmptyList onClick={() => setOpenNewEdit(true)} />
                  :
                  listCliente.map((item, index) => (
                    <ItemCliente
                      key={index}
                      {...item}
                      handleOpenInfoModal={handleOpenInfoModal}
                      handleOpenEditModal={handleOpenEditModal}
                      handleOpenSeniaModal={handleOpenSeniaModal}
                    />
                  ))
                }
              </List>
            </>
          }
          {openNewEdit && (
            <>
              <Modal
                open={openNewEdit}
                title={clientSelected ? 'Editar Cliente' : 'Nuevo Cliente'}
                height='45%'
                width='40%'
                eClose={()=>setOpenNewEdit(false)}
              >
                <NewEditCliente item={clientSelected} handleClose={()=>setOpenNewEdit(false)} token={user.token} />
              </Modal>
            </>
          )}
          {openNewSenia && (
            <>
              <Modal
                open={openNewSenia}
                title={'Nueva seña'}
                height='45%'
                width='40%'
                eClose={()=>setOpenNewSenia(false)}
              >
                <NewSenia id={clientSelected._id} handleClose={()=>setOpenNewSenia(false)} token={user.token} />
              </Modal>
            </>
          )}
          {openInfo && (
            <>
              <Modal
                open={openInfo}
                title={'Info del Cliente'}
                height='45%'
                width='30%'
                eClose={()=>setOpenInfo(false)}
              >
                <InfoCliente {...clientSelected} handleClose={()=>setOpenInfo(false)} token={user.token} />
              </Modal>
            </>
          )}
    </>
  )
}

const fadeAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  overflow-y: scroll;
`

const AnimatedContainer1 = styled.div`
  animation: ${fadeAnimation} 0.5s ease-in-out;
`;

const AnimatedContainer2 = styled.div`
  animation: ${fadeAnimation} 0.5s ease-in-out;
`;