import { useFormik } from 'formik';
import React, { useState } from 'react'
import Input from '../Input';
import Button from '../Button';
import apiClient from '@/utils/client';
import { setAlert } from '@/redux/alertSlice';
import { useAppDispatch } from '@/redux/hook';
import Loading from '../Loading';

export default function PagarDeuda({venta, handleClose, token}) {

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            pago: 0
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
          
          if (formValue.pago <= 0 || formValue.pago > parseFloat(venta.total) - parseFloat(venta.dineroIngresado)) {
            dispatch(setAlert({
              message: 'Numero ingresado incorrecto',
              type: 'warning'
            }))
            return;
          }
          setLoading(true)
          apiClient.patch(`venta/${venta._id}`, {...venta, dineroIngresado: parseFloat(formValue.pago) + parseFloat(venta.dineroIngresado)} ,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(r=>{
            setLoading(false)
            handleClose()})
          .catch(e=>dispatch(setAlert({
            message: `${e.response.data.error}`,
            type: 'error'
          })))
        }
    })

  return (
    <div>
        <Input label={"Pago"} type='number' name='pago' value={formik.values.pago} onChange={formik.handleChange} required={true} prefix={'$'}  />
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
