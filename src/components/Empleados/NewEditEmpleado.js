import React, { useEffect, useState } from 'react'
import ToggleSwitch from '../ToggleSwitch'
import { useFormik } from 'formik'
import Input from '../Input'
import Button from '../Button'
import InputSelect from '../InputSelect'
import apiClient from '@/utils/client'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'

export default function NewEditEmpleado({token, item , edit, handleClose}) {

    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: initialValues(item),
        validateOnChange: false,
        onSubmit: (formValue) => {
          console.log("editar empelado", formValue)
          if (item) {
            apiClient.patch(`/empleado/${item._id}`, formValue ,
            {
              headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
            .then(r=>{
              handleClose()
              dispatch(setAlert({
                message: 'Empleado modificado correctamente',
                type: 'success'
              }))
            })
            .catch(e=>dispatch(setAlert({
              message: 'Hubo un error inesperado, revisa los datos',
              type: 'error'
            })))
          }else{
            apiClient.post(`/empleado`, formValue ,
            {
              headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
            .then(r=>{
              handleClose()
              dispatch(setAlert({
                message: 'Empleado creado correctamente',
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
        <Input label={"Nombre completo"} type='text' name='nombreCompleto' value={formik.values.nombreCompleto} onChange={formik.handleChange} required={true}  />
        <Input label={"Telefono"} type='text' name='telefono' value={formik.values.telefono} onChange={formik.handleChange} required={true}  />
        <Input label={"Direccion"} type='text' name='direccion' value={formik.values.direccion} onChange={formik.handleChange} required={true}  />
        <Input label={"Usuario"} type='text' name='usuario' value={formik.values.usuario} onChange={formik.handleChange} required={true}  />
        <Input label={"Contraseña"} type='password' name='password' value={formik.values.password} onChange={formik.handleChange} required={true} />
        <InputSelect label={"Sucursal"} type='text' name='sucursal' value={formik.values.sucursal}  onChange={(id, text)=>{
            formik.setFieldValue('idSucursal', id)
            formik.setFieldValue('sucursal', text)
          }} edit={item && true}  />
        <InputSelect label={"Rol"} type='text' name='roles' value={formik.values.roles}  onChange={(text)=>formik.setFieldValue('idRol', text)} edit={item && true} />
        <ToggleSwitch checked={formik.values.estado} onChange={(newValue)=>formik.setFieldValue(`estado`, newValue)} label={'Estado'} />
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
        direccion: '',
        estado: true,
        idSucursal: '',
        usuario: '',
        password: '',
        idRol: ''
    }
} 
