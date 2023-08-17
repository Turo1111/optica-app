import React, { useState } from 'react'
import ToggleSwitch from '../ToggleSwitch'
import { useFormik } from 'formik'
import Input from '../Input'
import Button from '../Button'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import apiClient from '@/utils/client'
import Loading from '../Loading'

export default function NewEditRol({token, item , edit, handleClose}) {

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
      initialValues: initialValues(item),
      validateOnChange: false,
      onSubmit: (formValue) => {
        if (formValue.descripcion === '') {
          dispatch(setAlert({
            message: 'Falta colocar una descripcion al rol',
            type: 'warning'
          }))
          return
        }
        setLoading(true)
        if (item) {
          apiClient.patch(`/roles/${item._id}`, formValue ,
          {
            headers: {
              Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
            }
          })
          .then(r=>{
            handleClose()
            dispatch(setAlert({
              message: 'Rol modificado correctamente',
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
        }else{
          apiClient.post(`/roles` , formValue,
          {
            headers: {
              Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
            }
          })
          .then(r=>{
            handleClose()
            dispatch(setAlert({
              message: 'Rol creado correctamente',
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
        <div>
            {
                 formik.values.permisos.map((permiso, index) => (
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 15}} key={index} >
                        <label>{permiso.screen}</label>
                        <ToggleSwitch checked={permiso.lectura} onChange={(newValue)=>formik.setFieldValue(`permisos[${index}].lectura`, !permiso.lectura)} label={'Lectura'} />
                        <ToggleSwitch checked={permiso.escritura} onChange={(newValue)=>formik.setFieldValue(`permisos[${index}].escritura`, !permiso.escritura)} label={'Escritura'} />
                    </div>
                ))
            }
            
        </div>
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
        permisos: [
            {
              screen: 'Venta',
              lectura: false,
              escritura: false,
            },
            {
              screen: 'Cliente',
              lectura: false,
              escritura: false,
            },
            {
              screen: 'Producto',
              lectura: false,
              escritura: false,
            },
            {
              screen: 'Gestion',
              lectura: false,
              escritura: false,
            },
            {
              screen: 'Contabilidad',
              lectura: false,
              escritura: false,
            },
            {
              screen: 'Compra',
              lectura: false,
              escritura: false,
            },
        ],
    }
} 
