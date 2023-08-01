import React, { useEffect, useState } from 'react'
import ToggleSwitch from '../ToggleSwitch'
import { useFormik } from 'formik'
import Input from '../Input'
import Button from '../Button'
import InputSelect from '../InputSelect'
import apiClient from '@/utils/client'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import TextArea from '../TextArea'

export default function NewSenia({id, token, handleClose}) {
  
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: initialValues(),
        validateOnChange: false,
        onSubmit: (formValue) => {
          if (formik.values.saldo > 0) {

            const senia = {
                ...formValue,
                fecha: new Date,
                idCliente: id,
                estado: true
            }
            apiClient.post(`/senia`, senia ,
            {
              headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
            .then(r=>{
              handleClose()
              dispatch(setAlert({
                message: 'Seña creada correctamente',
                type: 'success'
              }))
            })
            .catch(e=>dispatch(setAlert({
              message: 'Hubo un error inesperado, revisa los datos',
              type: 'error'
            }))) 
          }
          else{
            dispatch(setAlert({
                message: 'Armazon o Lentes tiene que ser mayor a 0',
                type: 'error'
              }))
          }
        }
    })

  return (
    <div>
        <TextArea  label={"Observacion"} name='observacion' value={formik.values.observacion} onChange={formik.handleChange}/>
        <Input label={"Saldo Total"} type='number' name='saldo' prefix={'$'} value={formik.values.saldo} onChange={formik.handleChange} />
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 15}}>
            <Button text={'CANCELAR'} onClick={handleClose}/>
            <Button text={'ACEPTAR'} onClick={formik.handleSubmit}/>
        </div>
    </div>
  )
}

function initialValues () {
    return {
        observacion: '',
        saldo: 0
    }
} 
