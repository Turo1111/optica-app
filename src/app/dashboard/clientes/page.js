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
import NotPermissions from '@/components/NotPermissions'
import { useInputValue } from '@/hooks/useInputValue'
import { useSearch } from '@/hooks/useSearch'
import { setAlert } from '@/redux/alertSlice'
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
  const [tagSearch, setTagSearch] = useState([])

  const tag = ["nombreCompleto", "telefono", "dni"]

  const listCliente = useSearch(search.value, tag, data, tagSearch) 

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
  },[openNewEdit, user.roles.permisos, user.usuario, dispatch])

  useEffect(() => {
    const getCliente = () => {
      setLoading(true);
      if (user.token) {
        apiClient.get('/cliente', {
          headers: {
            Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
          .then((r) => {
            setData((prevData) => {
              setLoading(false);
              return r.data.body;
            });
          })
          .catch((e) =>
            dispatch(
              setAlert({
                message: `${e.response.data.error || 'Ocurrió un error'}`,
                type: 'error',
              })
            )
          );
      }
    };
  
    getCliente();
  }, [user.token, dispatch]);

  useEffect(()=>{
    const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
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

  useEffect(()=>{
    const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
    socket.on('senia', (senia) => {
      setData((prevData)=>{
        const exist = prevData.find(elem => elem._id === senia.res.idCliente )
        if (exist) {
          return prevData.map((item) =>{
          /* item._id === senia.res.idCliente ? (item.senia = senia.res) : item */
          if (item._id === senia.res.idCliente) {
            return {
              ...item,
              senia: senia.res
            }
          }else{
            return item
          }
        })
        }
        return [...prevData, cliente.res]
      })
    })
    return () => {
      socket.disconnect();
    }; 
  },[data])

  const handleOpenEditModal = (item) => {
    if(item._id === '64c95db35ae46355b5f7df64'){
      dispatch(
        setAlert({
          message: `No se puede modificar este cliente`,
          type: 'error',
        })
      )
      return
    }
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
    return <NotPermissions/>
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
              <ContainerSearch>
                <InputSearch placeholder={'Buscar Clientes'} {...search}
                  tags={tag}
                  tagSearch={tagSearch}
                  deleteTagSearch={(item) => setTagSearch((prevData) => prevData.filter((elem) => elem.tag !== item.tag))}
                  onSelectTag={(search, tag) =>
                    tag !== 'SIN ETIQUETA' &&
                    setTagSearch((prevData) =>
                      !prevData.find((elem) => elem.tag === tag) ? [...prevData, { search, tag }] : prevData
                    )
                  }
                  width="80%"
                />
                <Button text={'NUEVO'} onClick={() => {
                  setOpenNewEdit(true)
                  setClientSelected(undefined)
                }} />
              </ContainerSearch>
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
                height='auto'
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
                height='auto'
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
                height='auto'
                width='50%'
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
const ContainerSearch = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media only screen and (max-width: 445px) {
    flex-direction: column;
  }
`