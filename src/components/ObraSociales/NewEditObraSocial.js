import React, { useState } from 'react'
import ToggleSwitch from '../ToggleSwitch'
import { useFormik } from 'formik'
import Input from '../Input'
import Button from '../Button'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch } from '@/redux/hook'
import apiClient from '@/utils/client'

export default function NewEditObraSocial({item , edit, handleClose}) {

    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: initialValues(item),
        validateOnChange: false,
        onSubmit: (formValue) => {
          console.log(formValue)
          if (item) {
            apiClient.patch(`/obrasocial/${item._id}`, formValue)
            .then(r=>{
              handleClose()
              dispatch(setAlert({
                message: 'Obra Social modificada correctamente',
                type: 'success'
              }))
            })
            .catch(e=>dispatch(setAlert({
              message: 'Hubo un error inesperado, revisa los datos',
              type: 'error'
            })))
          }else{
            apiClient.post(`/obrasocial`, formValue)
            .then(r=>{
              handleClose()
              dispatch(setAlert({
                message: 'Obra Social creada correctamente',
                type: 'success'
              }))
            })
            .catch(e=>dispatch(setAlert({
              message: 'Hubo un error inesperado, revisa los datos',
              type: 'error'
            })))
          }
        }
    })

  return (
    <div>
        <Input label={"Descripcion"} type='text' name='descripcion' value={formik.values.descripcion} onChange={formik.handleChange} required={true}  />
        <Input label={"Descuento"} type='number' name='cantidadDescuento' value={formik.values.cantidadDescuento} onChange={formik.handleChange}/>
        <Input label={"Devolucion"} type='number' name='cantidadDevuelta' value={formik.values.cantidadDevuelta} onChange={formik.handleChange}/>
        <ToggleSwitch checked={formik.values.tipoDescuento} onChange={(newValue)=>formik.setFieldValue('tipoDescuento', newValue)} label={formik.values.tipoDescuento ? 'Efectivo' : 'Porcentaje'}/>
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
        descripcion: '',
        cantidadDescuento: '',
        cantidadDevuelta: '',
        tipoDescuento: true,
    }
} 
