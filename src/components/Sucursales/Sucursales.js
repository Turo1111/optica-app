import React, { useEffect, useState } from 'react'
import InputSearch from '../InputSearch'
import Button from '../Button'
import NewEditSucursal from './NewEditSucursal'
import apiClient from '@/utils/client'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import styled from 'styled-components'
const io = require('socket.io-client')

export default function Sucursales() {

    const [openNewEdit, setOpenNewEdit] = useState(false)
    const [selected, setSelected] = useState(undefined)
    const [data, setData] = useState([])
    const dispatch = useAppDispatch();

    useEffect(()=>{
      apiClient.get(`/sucursal`)
          .then(r=>{
            setData(r.data.body)
          })
          .catch(e=>dispatch(setAlert({
            message: 'Hubo un error inesperado al cargar los empleados s',
            type: 'error'
          })))
    },[])

    useEffect(()=>{
      const socket = io('http://localhost:3001')
      socket.on('sucursal', (sucursal) => {
        setData((prevData)=>{
          const exist = prevData.find(elem => elem._id === sucursal.res._id )
          if (exist) {
            return prevData.map((item) =>
            item._id === sucursal.res._id ? sucursal.res : item
          )
          }
          return [...prevData, sucursal.res]
        })
      })
      return () => {
        socket.disconnect();
      }; 
    },[data])

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: 25}} >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <InputSearch placeholder={'Buscar Sucursal'} />
        <Button text={'NUEVO'} onClick={()=>setOpenNewEdit(true)} />
      </div> 
      {
        openNewEdit ? 
        <NewEditSucursal handleClose={()=>setOpenNewEdit(false)} item={selected} edit={selected && true} />
        :
        <ul style={{flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0 }}>
            {
              data.length === 0 ?
              <h2>No hay sucursales creadas</h2>
              :
                data.map((item,index)=>(
                    <Item key={index} onClick={()=>{
                      setSelected(item)
                      setOpenNewEdit(true)
                    }} >
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}} >
                            <label style={{fontSize: 18, fontWeight: 500, color: `${process.env.TEXT_COLOR}`}}>{item.descripcion}</label>
                            <label style={{fontSize: 16, fontWeight: 400, color: `${process.env.TEXT_COLOR}`}}>{item.estado}</label>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}} >
                            <label style={{fontSize: 16, fontWeight: 400, color: `${process.env.TEXT_COLOR}`}}>{item.direccion}</label>
                            <label style={{fontSize: 16, fontWeight: 400, color: `${process.env.TEXT_COLOR}`}}>{item.telefono}</label>
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

