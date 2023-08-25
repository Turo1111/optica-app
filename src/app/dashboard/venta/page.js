'use client'
import EmptyList from '@/components/EmptyList';
import InputSearch from '@/components/InputSearch';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import NotPermissions from '@/components/NotPermissions';
import InfoVenta from '@/components/Ventas/InfoVenta';
import ItemVenta from '@/components/Ventas/ItemVenta';
import PagarDeuda from '@/components/Ventas/PagarDeuda';
import { useInputValue } from '@/hooks/useInputValue';
import { useSearch } from '@/hooks/useSearch';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getUser } from '@/redux/userSlice';
import apiClient from '@/utils/client';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
const io = require('socket.io-client')

export default function Venta() {
  
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const user = useAppSelector(getUser);
  const [permission, setPermission] = useState(false)
  const dispatch = useAppDispatch();
  const [ventaSelected, setVentaSelected] = useState(undefined)
  const [openInfo, setOpenInfo] = useState(false)
  const [openSaldo, setOpenSaldo] = useState(false)
  const [tagSearch, setTagSearch] = useState([])

  const search = useInputValue('','')

  const tag = ["cliente", "sucursal", 'empleado']

  const listVentas = useSearch(search.value, tag, data, tagSearch)

  console.log(listVentas)

  useEffect(()=>{
    if (user.usuario !== '') {  
      user.roles.permisos.forEach((permiso) => {
          if (permiso.screen.toLowerCase() === 'venta') {
            if (!permiso.lectura) {
              return setPermission(false)
            }
            return setPermission(true)
          }
      });
    }
  },[user])

  useEffect(() => {
    setLoading(true)
    if (user.token) {
      apiClient.get('/venta' ,
      {
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
        .then(r => {
          console.log("data venta",r.data.body)
          setData((prevData)=>{
            setLoading(false)
            return r.data.body
          })
        })
        .catch(e => dispatch(setAlert({
          message: `${e.response.data.error}`,
          type: 'error'
        })))
    }
  }, [user.token])

  useEffect(()=>{
    const socket = io('http://localhost:3001')
    socket.on('venta', (venta) => {
      setData((prevData)=>{
        const exist = prevData.find(elem => elem._id === venta.res._id )
        if (exist) {
          return prevData.map((item) =>
          item._id === venta.res._id ? venta.res : item
        )
        }
        return [...prevData, venta.res]
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputSearch placeholder={'Buscar Ventas'} {...search} width='100%'
              tags={tag}
              tagSearch={tagSearch}
              deleteTagSearch={(item) => setTagSearch((prevData) => prevData.filter((elem) => elem.tag !== item.tag))}
              onSelectTag={(search, tag) =>
                tag !== 'SIN ETIQUETA' &&
                setTagSearch((prevData) =>
                  !prevData.find((elem) => elem.tag === tag) ? [...prevData, { search, tag }] : prevData
                )
              }
            />
          </div>
          <List>
            {
              listVentas.length === 0 ?
              <EmptyList onClick={() => setOpenNewProduct(true)} />
              :
              listVentas.map((item, index) => (
                <ItemVenta
                  key={index}
                  {...item}
                  handleOpenInfo={()=>{
                    setOpenInfo(true)
                    setVentaSelected(item)
                  }}
                  handleOpenSaldo={()=>{
                    setOpenSaldo(true)
                    setVentaSelected(item)
                  }}
                />
              ))
            }
          </List>
        </>
      }
      {
        openInfo && 
        <Modal 
          open={openInfo} 
          eClose={()=>setOpenInfo(false)} 
          title={'INFO DE LA VENTA'} 
          height='95%'
          width='35%'
        >
          <InfoVenta {...ventaSelected} token={user.token}/>
        </Modal>
      }
      {
        openSaldo && 
        <Modal 
          open={openSaldo} 
          eClose={()=>setOpenSaldo(false)} 
          title={'PAGAR DEUDA'} 
          height='auto'
          width='35%'
        >
          <PagarDeuda venta={ventaSelected} handleClose={()=>setOpenSaldo(false)} token={user.token} />
        </Modal>
      }
    </>
  )
}

const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  overflow-y: scroll;
`