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
import Loading from '../Loading'

export default function NewSenia({id, token, handleClose}) {
  
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: initialValues(),
        validateOnChange: false,
        onSubmit: (formValue) => {
          if (id === '64c95db35ae46355b5f7df64') {
            dispatch(setAlert({
              message: 'No puede crear senia a Consumidor Final',
              type: 'error'
            }))
            return
          }
          if (formik.values.saldo > 0) {
            const senia = {
                ...formValue,
                fecha: new Date,
                idCliente: id,
                estado: true
            }
            setLoading(true)
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
              setLoading(false)
            })
            .catch(e=>{
              console.log(e);
                dispatch(setAlert({
                message: `${e.response.data.error}`,
                type: 'error'
                }))
            }) 
          }
          else{
            dispatch(setAlert({
                message: 'Armazon o Lentes tiene que ser mayor a 0',
                type: 'error'
              }))
          }
        }
    })

  return (
    <div>
        <TextArea  label={"Observacion"} name='observacion' value={formik.values.observacion} onChange={formik.handleChange}/>
        <Input label={"Saldo Total"} type='number' name='saldo' prefix={'$'} value={formik.values.saldo} onChange={formik.handleChange} />
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

function initialValues () {
    return {
        observacion: '',
        saldo: 0
    }
} 
