import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import Input from '../Input';
import Button from '../Button';
import apiClient from '@/utils/client';
import { setAlert } from '@/redux/alertSlice';
import { useAppDispatch } from '@/redux/hook';
import Loading from '../Loading';
import { useDate } from '@/hooks/useDate';
import Confirm from '../Confirm';

export default function PagarDeuda({venta, handleClose, token, idSucursal}) {

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
    const {date} = useDate()
    const [openConfirm, setOpenConfirm] = useState(false)
    const [lastCC, setLastCC] = useState(undefined)

    const getLastDate = ( ) => {
      apiClient.get(`cierreCaja/lastDate/${idSucursal}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(r=>{
        console.log("fecha cc",r.data.body);
        setLastCC(new Date(r.data.body.fecha))
      })
      .catch(e=>{
        setLoading(false)
        dispatch(setAlert({
        message: `${e.response.data.error || 'Ocurrio un error'}`,
        type: 'error'
      }))})
    }

    useEffect(()=>{
      getLastDate()
    },[venta._id])

    const formik = useFormik({
        initialValues: {
            pago: 0
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
          if (new Date(venta.fecha) > lastCC) {
            dispatch(setAlert({
              message: 'No puede ingresar un pago sin realizar el cierre de caja del local',
              type: 'warning'
            }))
            return;
          } 
          if (venta.tipoPago.descripcion === 'EFECTIVO Y TARJETA' || venta.tipoPago.descripcion === 'TARJETA') {
            dispatch(setAlert({
              message: 'Accion incorrecta para el tipo de pago',
              type: 'warning'
            }))
            return;
          }
          if (formValue.pago <= 0 || formValue.pago > parseFloat(venta.total) - parseFloat(venta.dineroIngresado)) {
            dispatch(setAlert({
              message: 'Numero ingresado incorrecto',
              type: 'warning'
            }))
            return;
          }
          setLoading(true)
          apiClient.patch(`venta/${venta._id}`, {...venta, dineroIngresado: parseFloat(formValue.pago) + parseFloat(venta.dineroIngresado), pago : [...venta.pago, {
            fecha: date,
            total: formValue.pago
          }]} ,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(r=>{
            setLoading(false)
            handleClose()})
          .catch(e=>{
            setLoading(false)
            dispatch(setAlert({
            message: `${e.response.data.error || 'Ocurrio un error'}`,
            type: 'error'
          }))})
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
