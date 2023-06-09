import React, { useEffect, useState } from 'react'
import InputSearch from '../InputSearch'
import Button from '../Button'
import styled from 'styled-components'
import NewEditEmpleado from './NewEditEmpleado'
const io = require('socket.io-client')
import apiClient from '@/utils/client'

export default function Empleados() {

    const [openNewEdit, setOpenNewEdit] = useState(false)
    const [selected, setSelected] = useState(undefined)
    const [data, setData] = useState([])

    useEffect(()=>{
      apiClient.get(`/empleado`)
          .then(r=>{
            setData(r.data.body)
          })
          .catch(e=>dispatch(setAlert({
            message: 'Hubo un error inesperado al cargar los empleados',
            type: 'error'
          })))
    },[])

    useEffect(()=>{
      const socket = io('http://localhost:3001')
      socket.on('empleado', (empleado) => {
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

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: 25}} >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <InputSearch placeholder={'Buscar Empleado'} />
        <Button text={'NUEVO'} onClick={()=>setOpenNewEdit(!openNewEdit)} />
      </div> 
      {
        openNewEdit ? 
        <NewEditEmpleado handleClose={()=>setOpenNewEdit(false)} item={selected} />
        :
        <ul style={{flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0 }}>
            {
              data.length === 0 ?
              <h2>No hay empleados creados</h2>
              :
              data.map((item,index)=>(
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
        </ul>
      }
    </div>
  )
}

const Item = styled.li `
  padding: 15px;
  list-style: none;
  cursor: pointer;
  :hover{
      background-color: #F9F5F6;
  };
`


