'use client'
import Button from '@/components/Button'
import InfoCompra from '@/components/Compra/InfoCompra'
import ItemCompra from '@/components/Compra/ItemCompra'
import NewCompra from '@/components/Compra/NewCompra'
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
import { io } from 'socket.io-client'
import styled from 'styled-components'

export default function Compra() {

  const [compraSelected, setCompraSelected] = useState(undefined)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const user = useAppSelector(getUser);
  const [permission, setPermission] = useState(false)
  const dispatch = useAppDispatch();
  const search = useInputValue('','')
  const [tagSearch, setTagSearch] = useState([])
  const [openInfo, setOpenInfo] = useState(false)
  const [openNew, setOpenNew] = useState(false)
  const tag = ["proveedor", "sucursal"]

  const listCompra = useSearch(search.value, tag, data, tagSearch) 

  const getCompra = () => {
    setLoading(true);
      if (user.token) {
        apiClient.get('/compra', {
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

  useEffect(()=>{
    getCompra()
  },[user.token, dispatch])

  useEffect(()=>{
    if (user.usuario !== '') {  
      user.roles.permisos.forEach((permiso) => {
          if (permiso.screen.toLowerCase() === 'compra') {
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
        if (permiso.screen.toLowerCase() === 'compra') {
          if (!permiso.escritura) {
            dispatch(setAlert({
              message: 'NO TIENES PERMISOS DE USUARIO',
              type: 'error'
            }))
          }
        }
      });
    }
  },[openNew, user.roles.permisos, user.usuario, dispatch])

  useEffect(()=>{
    const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
    socket.on('compra', (compra) => {
      setData((prevData)=>{
        const exist = prevData.find(elem => elem._id === compra.res._id )
        if (exist) {
          return prevData.map((item) =>
          item._id === compra.res._id ? compra.res : item
        )
        }
        return [...prevData, compra.res]
      })
    })
    return () => {
      socket.disconnect();
    }; 
  },[data])

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
            <InputSearch placeholder={'Buscar Compra'} {...search}
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
              setOpenNew(true)
              setCompraSelected(undefined)
            }} />
          </ContainerSearch>
          <List>
            {
              listCompra.length === 0 ?
              <EmptyList onClick={() => setOpenNew(true)} />
              :
              listCompra.map((item, index) => (
                <ItemCompra
                  key={index}
                  {...item} 
                  handleOpenInfo={()=>{
                    setOpenInfo(true)
                    setCompraSelected(item)
                  }}
                />
              ))
            }
          </List>
        </>
      }
      {openNew && (
        <>
          <Modal
            open={openNew}
            title={'Nueva Compra'}
            height='auto'
            width='60%'
            eClose={()=>setOpenNew(false)}
          >
            <NewCompra handleClose={()=>setOpenNew(false)} token={user.token}/>
          </Modal>
        </>
      )}
      {openInfo && (
        <>
          <Modal
            open={openInfo}
            title={'Informacion de compra'}
            height='auto'
            width='60%'
            eClose={()=>setOpenInfo(false)}
          >
            <InfoCompra {...compraSelected} handleClose={()=>setOpenInfo(false)} token={user.token}/>
          </Modal>
        </>
      )}
    </>
  )
}

const ContainerSearch = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media only screen and (max-width: 445px) {
    flex-direction: column;
  }
`
const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  overflow-y: scroll;
`
