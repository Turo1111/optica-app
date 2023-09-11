import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import InputSelect from '../InputSelect'
import Input from '../Input'
import Button from '../Button'
import apiClient from '@/utils/client'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { getUser } from '@/redux/userSlice'
import Loading from '../Loading'
import Confirm from '../Confirm'

export default function NewStock({idProducto, item, eClose, precioGeneral}) {

    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const [loading, setLoading] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
  
    const formik = useFormik({
        initialValues: initialValues(idProducto, item, precioGeneral),
        validateOnChange: false,
        onSubmit: (formValue) => {
          if (formValue.idSucursal === '') {
            dispatch(setAlert({
              message: 'Debe ingresar una sucursal',
              type: 'warning'
            }))
            return;
          }
          if (formValue.cantidad < 0) {
            dispatch(setAlert({
              message: 'Debe ingresar una cantida mayor a 0',
              type: 'warning'
            }))
            return;
          }
          if (formValue.precioEfectivo < 0 || formValue.precioLista < 0) {
            dispatch(setAlert({
              message: 'Debe ingresar precios mayores a 0',
              type: 'warning'
            }))
            return;
          }
          setLoading(true)
          if (item) {
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
                setLoading(false)
              })
              .catch(e=>{
                setLoading(false)
                dispatch(setAlert({
                message: `${e.response.data.error || 'Ocurrio un error'}`,
                type: 'error'
              }))})
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
    
    const handleClose = () => {
        formik.resetForm(initialValues)
        eClose()
    }

    useEffect(()=>{
      formik.setFieldValue('precioLista', (formik.values.precioEfectivo+(formik.values.precioEfectivo*0.2)).toFixed(2))
    },[formik.values.precioEfectivo])
    
    return (
        <div>
            <InputSelect label={"Sucursal"} type='text' name='sucursal' value={formik.values.sucursal}  onChange={(id, item)=>{
              formik.setFieldValue('idSucursal', id)
              formik.setFieldValue('sucursal', item.descripcion)
            }} />
            <Input label={"Stock"} type='number' name='cantidad' value={formik.values.cantidad} onChange={formik.handleChange} required={true}  />
            <Input label={"Precio efectivo"} type='number' name='precioEfectivo' value={formik.values.precioEfectivo} onChange={formik.handleChange} required={true} prefix={'$'} />
            <Input label={"Precio lista"} type='number' name='precioLista' value={formik.values.precioLista} onChange={formik.handleChange} required={true} prefix={'$'} />
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
            {
              loading ? 
              <Loading />:
              <>
                <Button text={'CANCELAR'} onClick={handleClose}/>
                <Button text={'GUARDAR'} onClick={()=>setOpenConfirm(true)}/>
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

function initialValues (idProducto, item, precioGeneral) {
    if (item) {
        return item
    }
    return{
        cantidad: '',
        idSucursal: '',
        idProducto: idProducto,
        precioEfectivo: precioGeneral,
        precioLista: parseFloat(precioGeneral)+(parseFloat(precioGeneral)*0.2)
    }
}