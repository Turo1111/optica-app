import React, { useEffect, useState } from 'react'
import InputSearch from '../InputSearch'
import Button from '../Button'
import styled, { keyframes } from 'styled-components'
import NewEditRol from './NewEditRol'
import apiClient from '@/utils/client'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import Loading from '../Loading'
import EmptyList from '../EmptyList'
import { getUser } from '@/redux/userSlice'
import { useInputValue } from '@/hooks/useInputValue'
import { useSearch } from '@/hooks/useSearch'
const io = require('socket.io-client')

export default function Roles() {

    const [openNewEdit, setOpenNewEdit] = useState(false)
    const [data, setData] = useState([])
    const [selected, setSelected] = useState(undefined)
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
    const user = useAppSelector(getUser);
    const search = useInputValue('','')

    const tag = ["descripcion"]

    const listRoles = useSearch(search.value, tag, data)

    useEffect(()=>{
      setLoading(true)
      apiClient.get(`/roles` ,
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
            <InputSearch placeholder={'Buscar Rol'} {...search} />
            <Button text={'NUEVO'} onClick={()=>{
                setSelected(undefined)
                setOpenNewEdit(true)
              }} />
          </div> 
          {
            openNewEdit ? 
            <AnimatedContainer1>
              <NewEditRol handleClose={()=>setOpenNewEdit(false)} item={selected} token={user.token} />
            </AnimatedContainer1>
            :
            <AnimatedContainer2>
              <ul style={{flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0 }}>
                  {
                    listRoles.length === 0 ?
                    <EmptyList onClick={() => setOpenNewEdit(true)} />
                    :
                    listRoles.map((item,index)=>(
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


