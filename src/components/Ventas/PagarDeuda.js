import { useFormik } from 'formik';
import React from 'react'
import Input from '../Input';
import Button from '../Button';
import apiClient from '@/utils/client';
import { setAlert } from '@/redux/alertSlice';
import { useAppDispatch } from '@/redux/hook';

export default function PagarDeuda({venta, handleClose, token}) {

    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            pago: 0
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
          console.log(formValue.pago <= 0, formValue.pago > parseFloat(venta.total) - parseFloat(venta.dineroIngresado), parseFloat(venta.total) - parseFloat(venta.dineroIngresado));
          if (formValue.pago <= 0 || formValue.pago > parseFloat(venta.total) - parseFloat(venta.dineroIngresado)) {
            dispatch(setAlert({
              message: 'Numero ingresado incorrecto',
              type: 'warning'
            }))
            return;
          }
          apiClient.patch(`venta/${venta._id}`, {...venta, dineroIngresado: parseFloat(formValue.pago) + parseFloat(venta.dineroIngresado)} ,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(r=>handleClose())
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
            <Button text={'CANCELAR'} onClick={handleClose}/>
            <Button text={'ACEPTAR'} onClick={formik.handleSubmit}/>
        </div>
    </div>
  )
}
