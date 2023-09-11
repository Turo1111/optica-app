import { useDate } from '@/hooks/useDate'
import { useInputValue } from '@/hooks/useInputValue'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { getUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import React, { useEffect, useState } from 'react'
import Input from './Input'
import Button from './Button'
import Loading from './Loading'
import styled from 'styled-components'
import Confirm from './Confirm'

export default function CierreCaja({token, idSucursal, onClose}) {

    const {date: fecha} = useDate() 
    const [data, setData] = useState([])
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
    const total = useInputValue(0, 'number')
    const user = useAppSelector(getUser);
    const newFecha = new Date()
    const [openConfirm, setOpenConfirm] = useState(false)

    const getSaleToday = () => {
      setLoading(true)
      if (token) {
        apiClient.get(`/venta/${idSucursal}` ,
        {
          headers: {
            Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
        .then(r => {
          setData((prevData)=>{
            setLoading(false)
            return r.data.body
          })
        })
        .catch(e => dispatch(setAlert({
          message: `${e.response.data.error || 'Ocurrio un error'}`,
          type: 'error'
        })))
      }
    }

    const handleCreate = () => {
      if (data.total <= 0) {
        dispatch(setAlert({
          message: 'Sin dinero en caja para cerrar',
          type: 'warning'
        }))
        return;
      }
      setLoading(true)
      apiClient.post(`/cierrecaja`, {
        fecha: newFecha,
        idEmpleado: user.idEmpleado,
        idSucursal: user.idSucursal,
        totalEsperado: data.total,
        total: parseFloat(total.value)
      },
        {
          headers: {
            Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
        .then(r => {
          onClose()
          setLoading(false)
          dispatch(setAlert({
            message: `Cierre de caja realizado correctamente`,
            type: 'success'
          }))
        })
        .catch(e => {
          setLoading(false)
          dispatch(setAlert({
          message: `${e.response.data.error || 'Ocurrio un error'}`,
          type: 'error'
        }))})
    }

    useEffect(()=>{
      getSaleToday()
    },[token])

  return (
    <div>
        <Caracteristicas>Fecha : {fecha}</Caracteristicas>
        <Caracteristicas>Empleado : {user.usuario}</Caracteristicas>
        <Caracteristicas>Sucursal : {user.sucursal}</Caracteristicas>
        <Caracteristicas>Total esperado en caja : $ {data.total}</Caracteristicas>
        <Input label={"Total"} type='number' name='total' value={total.value} onChange={total.onChange} />
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          {
            loading ? 
            <Loading />:
            <>
              <Button text={'CANCELAR'} onClick={onClose}/>
              <Button text={'ACEPTAR'} onClick={()=>setOpenConfirm(true)}/>
            </>
          }
        </div>
        {
              openConfirm &&
              <Confirm
                confirmAction={handleCreate}
                handleClose={()=>setOpenConfirm(false)}
                loading={loading}
                open={openConfirm}
              />
            }
    </div>
  )
}

const Caracteristicas = styled.h6 `
    font-size: 16px;
    font-weight: 400;
    margin: 15px 0;
    color: ${process.env.TEXT_COLOR};
`