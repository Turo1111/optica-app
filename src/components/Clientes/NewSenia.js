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
          if (formik.values.armazon > 0 || formik.values.lente > 0) {

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

    useEffect(()=>{
        let total = formik.values.saldo
        if (formik.values.armazon > 0 || formik.values.lente > 0) {
            total = formik.values.armazon+formik.values.lente
        }
        else{
            total = 0
        }
        formik.setFieldValue('saldo', total)
    },[formik.values.armazon, formik.values.lente])

  return (
    <div>
        <Input label={"Armazon"} type='number' name='armazon' prefix={'$'} value={formik.values.armazon} onChange={formik.handleChange} required={true}  />
        <Input label={"Lente"} type='number' name='lente' prefix={'$'} value={formik.values.lente} onChange={formik.handleChange} required={true}  />
        <TextArea  label={"Observacion"} name='observacion' value={formik.values.observacion} onChange={formik.handleChange}/>
        <Input label={"Saldo Total"} type='number' name='saldo' prefix={'$'} value={formik.values.saldo} onChange={formik.handleChange} readOnly={true}/>
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 15}}>
            <Button text={'CANCELAR'} onClick={handleClose}/>
            <Button text={'ACEPTAR'} onClick={formik.handleSubmit}/>
        </div>
    </div>
  )
}

function initialValues () {
    return {
        armazon: 0,
        lente: 0,
        observacion: '',
        saldo: 0
    }
} 
