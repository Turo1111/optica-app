import React, { useState } from 'react'
import ToggleSwitch from '../ToggleSwitch'
import { useFormik } from 'formik'
import Input from '../Input'
import Button from '../Button'
import apiClient from '@/utils/client'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import Loading from '../Loading'

export default function NewEditSucursal({token, item , edit, handleClose}) {

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: initialValues(item),
        validateOnChange: false,
        onSubmit: (formValue) => {
          if (formValue.descripcion === '') {
            dispatch(setAlert({
              message: 'Debe ingresar una descripcion a la sucursal',
              type: 'warning'
            }))
            return;
          }
          setLoading(true)
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
              setLoading(false)
            })
            .catch(e=>{
              setLoading(false)
              dispatch(setAlert({
              message: `${e.response.data.error}`,
              type: 'error'
            }))})
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
              setLoading(false)
            })
            .catch(e=>{
              setLoading(false)
              dispatch(setAlert({
              message: `${e.response.data.error}`,
              type: 'error'
            }))})
          }
        }
    })

  return (
    <div>
        <Input label={"Descripcion"} type='text' name='descripcion' value={formik.values.descripcion} onChange={formik.handleChange} required={true}  />
        <Input label={"Direccion"} type='text' name='direccion' value={formik.values.direccion} onChange={formik.handleChange}/>
        <Input label={"Telefono"} type='text' name='telefono' value={formik.values.telefono} onChange={formik.handleChange}/>
        <ToggleSwitch checked={formik.values.estado} onChange={(newValue)=>formik.setFieldValue('estado', !formik.values.estado)} label={'Estado'}/>
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 15}}>
          {
            loading ? 
            <Loading />:
            <>
              <Button text={'CANCELAR'} onClick={handleClose}/>
              <Button text={'ACEPTAR'} onClick={formik.handleSubmit}/>
            </>
          }
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
