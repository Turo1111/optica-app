import { useFormik } from 'formik'
import React from 'react'
import InputSelect from './InputSelect'
import Input from './Input'
import Button from './Button'
import apiClient from '@/utils/client'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { getUser } from '@/redux/userSlice'

export default function NewStock({idProducto, item, eClose}) {

    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
  
    const formik = useFormik({
        initialValues: initialValues(idProducto, item),
        validateOnChange: false,
        onSubmit: (formValue) => {
          if (item) {
            console.log(formValue)
            apiClient.patch(`/stock/${item._id}`, formValue,
            {
              headers: {
                Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
              .then(r=>{
                handleClose()
                dispatch(setAlert({
                  message: 'Stock modificado correctamente',
                  type: 'success'
                }))
              })
              .catch(e=>dispatch(setAlert({
                message: 'Hubo un error inesperado, revisa los datos',
                type: 'error'
              })))
          }else{
              apiClient.post('/stock', formValue,
              {
                headers: {
                  Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
                }
              })
              .then(r=>{
                handleClose()
                dispatch(setAlert({
                  message: 'Stock creado correctamente',
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
    
    const handleClose = () => {
        formik.resetForm(initialValues)
        eClose()
    }
    
    return (
        <div>
            <InputSelect label={"Sucursal"} type='text' name='sucursal' value={formik.values.sucursal}  onChange={(id, item)=>{
              formik.setFieldValue('idSucursal', id)
              formik.setFieldValue('sucursal', item.descripcion)
            }} />
            <Input label={"Stock"} type='number' name='cantidad' value={formik.values.cantidad} onChange={formik.handleChange} required={true}  />
            <Input label={"Precio efectivo"} type='number' name='precioEfectivo' value={formik.values.precioEfectivo} onChange={formik.handleChange} required={true}  />
            <Input label={"Precio lista"} type='number' name='precioLista' value={formik.values.precioLista} onChange={formik.handleChange} required={true}  />
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
                <Button text={'CANCELAR'} onClick={handleClose}/>
                <Button text={'GUARDAR'} onClick={formik.handleSubmit}/>
            </div>
        </div>
    )        
}

function initialValues (idProducto, item) {
    if (item) {
        return item
    }
    return{
        cantidad: '',
        idSucursal: '',
        idProducto: idProducto,
        precioEfectivo: '',
        precioLista: ''
    }
}