import React, { useEffect, useState } from 'react'
import ToggleSwitch from '../ToggleSwitch'
import { useFormik } from 'formik'
import Input from '../Input'
import Button from '../Button'
import InputSelect from '../InputSelect'
import apiClient from '@/utils/client'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import Loading from '../Loading'
import Confirm from '../Confirm'

export default function NewEditCliente({token, item , edit, handleClose}) {
  
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)

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
          setLoading(true)
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
              setLoading(false)
            })
            .catch(e=>{
              setLoading(false)
              dispatch(setAlert({
              message: `${e.response.data.error || 'Ocurrio un error'}`,
              type: 'error'
            }))})
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
              setLoading(false)
            })
            .catch(e=>{
              setLoading(false)
              dispatch(setAlert({
              message: `${e.response.data.error || 'Ocurrio un error'}`,
              type: 'error'
            }))})
          }
        }
    })

  return (
    <div>
        <Input label={"Nombre completo"} type='text' name='nombreCompleto' value={formik.values.nombreCompleto} onChange={formik.handleChange} required={true}  />
        <Input label={"Telefono"} type='text' name='telefono' value={formik.values.telefono} onChange={formik.handleChange}  />
        <Input label={"DNI"} type='text' name='dni' value={formik.values.dni} onChange={formik.handleChange} required={true}  />
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 15}}>
          {
            loading ? 
            <Loading />:
            <>
              <Button text={'CANCELAR'} onClick={handleClose}/>
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
