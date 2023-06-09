import React, { useEffect, useState } from 'react'
import InputSearch from '../InputSearch'
import Button from '../Button'
import styled from 'styled-components'
import NewEditRol from './NewEditRol'
import apiClient from '@/utils/client'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch } from '@/redux/hook'
const io = require('socket.io-client')

export default function Roles() {

    const [openNewEdit, setOpenNewEdit] = useState(false)
    const [data, setData] = useState([])
    const [selected, setSelected] = useState(undefined)
    const dispatch = useAppDispatch();

    useEffect(()=>{
      apiClient.get(`/roles`)
          .then(r=>{
            setData(r.data.body)
          })
          .catch(e=>dispatch(setAlert({
            message: 'Hubo un error inesperado al cargar los roles',
            type: 'error'
          })))
    },[])

    useEffect(()=>{
      const socket = io('http://localhost:3001')
      socket.on('roles', (roles) => {
        setData((prevData)=>{
          const exist = prevData.find(elem => elem._id === roles.res._id )
          if (exist) {
            return prevData.map((item) =>
            item._id === roles.res._id ? roles.res : item
          )
          }
          return [...prevData, roles.res]
        })
      })
      return () => {
        socket.disconnect();
      }; 
    },[data])

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: 25}} >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <InputSearch placeholder={'Buscar Rol'} />
        <Button text={'NUEVO'} onClick={()=>setOpenNewEdit(!openNewEdit)} />
      </div> 
      {
        openNewEdit ? 
        <NewEditRol handleClose={()=>setOpenNewEdit(false)} item={selected} />
        :
        <ul style={{flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0 }}>
            {
              data.length === 0 ?
              <h2>No hay roles creados</h2>
              :
              data.map((item,index)=>(
                  <Item key={index} onClick={()=>{
                    setSelected(item) 
                    setOpenNewEdit(true) 
                  }} >
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}} >
                          <label style={{fontSize: 18, fontWeight: 500, color: `${process.env.TEXT_COLOR}`}}>{item.descripcion}</label>
                          <label style={{fontSize: 16, fontWeight: 400, color: `${process.env.TEXT_COLOR}`}}>2 USUARIOS</label>
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


