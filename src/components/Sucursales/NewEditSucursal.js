import React from 'react'
import ToggleSwitch from '../ToggleSwitch'
import { useFormik } from 'formik'
import Input from '../Input'
import Button from '../Button'
import apiClient from '@/utils/client'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'

export default function NewEditSucursal({token, item , edit, handleClose}) {

    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: initialValues(item),
        validateOnChange: false,
        onSubmit: (formValue) => {
          if (item) {
            apiClient.patch(`/sucursal/${item._id}`, formValue ,
            {
              headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
            .then(r=>{
              dispatch(setAlert({
                message: 'Sucursal modificada correctamente',
                type: 'success'
              }))
              handleClose()
            })
            .catch(e=>dispatch(setAlert({
              message: `${e.response.data.error}`,
              type: 'error'
            })))
          }else{
            apiClient.post(`/sucursal`, formValue ,
            {
              headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
            .then(r=>{
              handleClose()
              dispatch(setAlert({
                message: 'Sucursal creada correctamente',
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
        <Input label={"Descripcion"} type='text' name='descripcion' value={formik.values.descripcion} onChange={formik.handleChange} required={true}  />
        <Input label={"Direccion"} type='text' name='direccion' value={formik.values.direccion} onChange={formik.handleChange}/>
        <Input label={"Telefono"} type='text' name='telefono' value={formik.values.telefono} onChange={formik.handleChange}/>
        <ToggleSwitch checked={formik.values.estado} onChange={(newValue)=>formik.setFieldValue('estado', newValue)} label={'Estado'}/>
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
        direccion: '',
        telefono: '',
        estado: true
    }
} 
