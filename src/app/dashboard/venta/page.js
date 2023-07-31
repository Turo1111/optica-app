'use client'
import EmptyList from '@/components/EmptyList';
import InputSearch from '@/components/InputSearch';
import Loading from '@/components/Loading';
import { useInputValue } from '@/hooks/useInputValue';
import { useSearch } from '@/hooks/useSearch';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getUser } from '@/redux/userSlice';
import apiClient from '@/utils/client';
import React, { useEffect, useState } from 'react'
const io = require('socket.io-client')

export default function Venta() {
  
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const user = useAppSelector(getUser);
  const [permission, setPermission] = useState(false)
  const dispatch = useAppDispatch();

  const search = useInputValue('','')

  const tag = ["descripcion", "codigo"]

  const listVentas = useSearch(search.value, tag, data)

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
        .catch(e => console.log(e))
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
            <InputSearch placeholder={'Buscar Productos'} {...search} />
          </div>
          <ul style={{ flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0, overflowY: scroll }}>
            {
              listVentas.length === 0 ?
              <EmptyList onClick={() => setOpenNewProduct(true)} />
              :
              listVentas.map((item, index) => (
                <div
                  key={index}
                >
                  '1'
                </div>
              ))
            }
          </ul>
        </>
      }
    </>
  )
}
