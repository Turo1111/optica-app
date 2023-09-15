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

export default function NewEditEmpleado({token, item , edit, handleClose}) {

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)

    const formik = useFormik({
        initialValues: initialValues(item),
        validateOnChange: false,
        onSubmit: (formValue) => {
          if (formValue.nombreCompleto === '') {
            dispatch(setAlert({
              message: 'Debe ingresar un nombre al empleado',
              type: 'warning'
            }))
            return
          }
          if (formValue.usuario === '') {
            dispatch(setAlert({
              message: 'Debe ingresar un nombre de usuario al empleado',
              type: 'warning'
            }))
            return
          }
          if (formValue.password  === '') {
            dispatch(setAlert({
              message: 'Debe ingresar una contraseña al empleado',
              type: 'warning'
            }))
            return
          }
          if (formValue.idSucursal  === '') {
            dispatch(setAlert({
              message: 'Debe asignar una sucursal al empleado',
              type: 'warning'
            }))
            return
          }
          if (formValue.idRol  === '') {
            dispatch(setAlert({
              message: 'Debe asignar un rol al empleado',
              type: 'warning'
            }))
            return
          }
          setLoading(true)
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
              setLoading(false)
            })
            .catch(e=>{
              setLoading(false)
              dispatch(setAlert({
              message: `${e.response.data.error || 'Ocurrio un error'}`,
              type: 'error'
            }))
            })
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
        <Input label={"Telefono"} type='text' name='telefono' value={formik.values.telefono} onChange={formik.handleChange} />
        <Input label={"Direccion"} type='text' name='direccion' value={formik.values.direccion} onChange={formik.handleChange} />
        <Input label={"Usuario"} type='text' name='usuario' value={formik.values.usuario} onChange={formik.handleChange} required={true}  />
        <Input label={"Contraseña"} type='password' name='password' value={formik.values.password} onChange={formik.handleChange} required={true} />
        <InputSelect label={"Sucursal"} type='text' name='sucursal' value={formik.values.sucursal}  onChange={(id, item)=>{
            formik.setFieldValue('idSucursal', id)
            formik.setFieldValue('sucursal', item.descripcion)
          }} edit={item && true}  />
        <InputSelect label={"Rol"} type='text' name='roles' value={formik.values.roles}  onChange={(id, item)=>{
          formik.setFieldValue('idRol', id)
          formik.setFieldValue('roles', item.descripcion)
        }} edit={item && true} />
        <ToggleSwitch checked={formik.values.estado} onChange={(newValue)=>formik.setFieldValue(`estado`, !formik.values.estado)} label={'Estado'} />
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
        direccion: '',
        estado: true,
        idSucursal: '',
        usuario: '',
        password: '',
        idRol: ''
    }
} 
