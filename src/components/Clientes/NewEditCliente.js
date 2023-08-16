import React, { useEffect, useState } from 'react'
import ToggleSwitch from '../ToggleSwitch'
import { useFormik } from 'formik'
import Input from '../Input'
import Button from '../Button'
import InputSelect from '../InputSelect'
import apiClient from '@/utils/client'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'

export default function NewEditCliente({token, item , edit, handleClose}) {
  
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: initialValues(item),
        validateOnChange: false,
        onSubmit: (formValue) => {
          if (formValue.nombreCompleto  === '') {
            dispatch(setAlert({
              message: 'Debe ingresar un nombre al cliente',
              type: 'warning'
            }))
            return
          }
          if (item) {
            apiClient.patch(`/cliente/${item._id}`, formValue ,
            {
              headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
            .then(r=>{
              handleClose()
              dispatch(setAlert({
                message: 'Cliente modificado correctamente',
                type: 'success'
              }))
            })
            .catch(e=>dispatch(setAlert({
              message: `${e.response.data.error}`,
              type: 'error'
            })))
          }else{
            apiClient.post(`/cliente`, formValue ,
            {
              headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
            .then(r=>{
              handleClose()
              dispatch(setAlert({
                message: 'Cliente creado correctamente',
                type: 'success'
              }))
            })
            .catch(e=>dispatch(setAlert({
              message: `${e.response.data.error}`,
              type: 'error'
            })))
          }
        }
    })

  return (
    <div>
        <Input label={"Nombre completo"} type='text' name='nombreCompleto' value={formik.values.nombreCompleto} onChange={formik.handleChange} required={true}  />
        <Input label={"Telefono"} type='text' name='telefono' value={formik.values.telefono} onChange={formik.handleChange}  />
        <Input label={"DNI"} type='text' name='dni' value={formik.values.dni} onChange={formik.handleChange} required={true}  />
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 15}}>
            <Button text={'CANCELAR'} onClick={handleClose}/>
            <Button text={'ACEPTAR'} onClick={formik.handleSubmit}/>
        </div>
    </div>
  )
}

function initialValues (item) {
    if (item) {
        return item
    }
    return {
        nombreCompleto: '',
        telefono: '',
        dni: ''
    }
} 
