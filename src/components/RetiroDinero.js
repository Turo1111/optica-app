import { useDate } from '@/hooks/useDate';
import { useInputValue } from '@/hooks/useInputValue';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getUser } from '@/redux/userSlice';
import apiClient from '@/utils/client';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Input from './Input';
import Button from './Button';
import { useFormik } from 'formik';
import InputSelect from './InputSelect';
import Loading from './Loading';
import { setAlert } from '@/redux/alertSlice';
import Confirm from './Confirm';

export default function RetiroDinero({token, onClose}) {

    const {date: fecha} = useDate() 
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
    const user = useAppSelector(getUser);
    const [data, setData] = useState(undefined)
    const [openConfirm, setOpenConfirm] = useState(false)

    const getSaleToday = () => {
        setLoading(true)
        if (token) {
          apiClient.get(`/venta/${formik.values.idSucursal}` ,
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

    const formik = useFormik({
        initialValues: {
            total: 0,
            idSucursal: '',
            sucursal: ''
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
          
            if (!data) {
                dispatch(setAlert({
                  message: 'Debe elegir una sucursal primero',
                  type: 'warning'
                }))
                return;
            }
            if (data.total <= 0) {
                dispatch(setAlert({
                  message: 'Sin dinero en caja para retirar',
                  type: 'warning'
                }))
                return;
            }
            if (formValue.total > data.total || formValue.total === 0) {
                dispatch(setAlert({
                  message: 'No se puede ingresar un dinero mayor al de caja o 0',
                  type: 'warning'
                }))
                return;
            }
            setLoading(true)
            apiClient.post(`/retirodinero`, {
              fecha: fecha,
              idEmpleado: user.idEmpleado,
              idSucursal: formValue.idSucursal,
              total: parseFloat(formValue.total)
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
                message: `Retiro de dinero realizado correctamente`,
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
    })

    useEffect(()=>{
        if (formik.values.idSucursal !== '') {
            getSaleToday()
        }
    },[formik.values.idSucursal])

  return (
    <div>
        <Caracteristicas>Fecha : {fecha}</Caracteristicas>
        <Caracteristicas>Empleado : {user.usuario}</Caracteristicas>
        <InputSelect label={"Sucursal"} type='text' name='sucursal' value={formik.values.sucursal}  onChange={(id, item)=>{
            formik.setFieldValue('idSucursal', id)
            formik.setFieldValue('sucursal', item.descripcion)
        }} />
        {data !== undefined && <Caracteristicas>Total en caja : $ {data.total}</Caracteristicas>}
        <Input label={"Total"} type='number' name='total' value={formik.values.total} onChange={formik.handleChange} />
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
                confirmAction={formik.handleSubmit}
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