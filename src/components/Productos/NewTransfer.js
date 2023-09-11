import React, { useEffect, useState } from 'react'
import InputSelect from '../InputSelect'
import { useFormik } from 'formik'
import Input from '../Input'
import Button from '../Button'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import apiClient from '@/utils/client'
import Loading from '../Loading'
import Confirm from '../Confirm'

export default function NewTransfer({item, token, handleClose}) {

    const dispatch = useAppDispatch();
    const [listStock, setListStock] = useState([])
    const [loading, setLoading] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)

    const formik = useFormik({
        initialValues: {
            idSalida: '',
            idDestino: '',
            cantidad: 0,
            precioEfectivo: item.precioGeneral,
            precioLista: parseFloat(item.precioGeneral)+(parseFloat(item.precioGeneral)*0.2)
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
            if (formValue.idDestino === formValue.idSalida) {
                dispatch(setAlert({
                    message: 'Se eligieron las mismas sucursales',
                    type: 'error'
                  })) 
                return null
            }
            if (listStock.length === 0) {
                dispatch(setAlert({
                    message: 'Ninguna de las sucursales tiene stock asociado',
                    type: 'error'
                  })) 
                return 0
            }
            let stockDestino = listStock.find(stock => stock.idSucursal === formValue.idDestino)
            let stockSalida = listStock.find(stock => stock.idSucursal === formValue.idSalida)
            if (stockSalida === undefined) {
                dispatch(setAlert({
                    message: 'Sucursal salida no posee stock asociado',
                    type: 'error'
                }))
                return null
            }
            if (stockSalida.cantidad < formValue.cantidad) {
                dispatch(setAlert({
                    message: 'Sucursal salida no posee stock suficiente',
                    type: 'error'
                }))
                return null
            }
            setLoading(true)
            if (stockDestino === undefined) {
                
                let newStock = {
                    idSucursal: formValue.idDestino,
                    idProducto: item._id,
                    cantidad: formValue.cantidad,
                    precioEfectivo: formValue.precioEfectivo,
                    precioLista: formValue.precioLista
                }

                if (formValue.precioEfectivo <= 0 && formValue.precioLista <= 0 ) {
                    dispatch(setAlert({
                        message: 'El precio tiene que ser distinto a 0',
                        type: 'error'
                    }))
                    return null
                }
                apiClient.post('/stock', newStock,
                {
                  headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
                  }
                })
                .then(r=>{
                  handleClose()
                  dispatch(setAlert({
                    message: 'Stock destino creado correctamente',
                    type: 'success'
                  }))
                  apiClient.patch(`/stock/${stockSalida._id}`, {
                    idSucursal: formValue.idSalida, 
                    cantidad: parseFloat(stockSalida.cantidad)-parseFloat(formValue.cantidad)
                  },
                    {
                      headers: {
                        Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
                      }
                    })
                    .then(r=>{
                      handleClose()
                      dispatch(setAlert({
                        message: 'Stock salida modificado correctamente',
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
                })
                .catch(e=>{
                  setLoading(false)
                  dispatch(setAlert({
                  message: `${e.response.data.error || 'Ocurrio un error'}`,
                  type: 'error'
                }))})
                return null
            }else{
                let newStockDestino = {
                    idSucursal: formValue.idDestino, 
                    cantidad: parseFloat(stockDestino.cantidad)+parseFloat(formValue.cantidad),
                    _id: stockDestino._id
                }
                if (formValue.precioEfectivo > 0 && formValue.precioLista > 0) {
                    newStockDestino.precioEfectivo = formValue.precioEfectivo
                    newStockDestino.precioLista = formValue.precioLista
                }
                apiClient.patch(`/stock/${stockDestino._id}`, newStockDestino,
                {
                  headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
                  }
                })
                .then(r=>{
                  handleClose()
                  dispatch(setAlert({
                    message: 'Stock salida modificado correctamente',
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
                apiClient.patch(`/stock/${stockSalida._id}`, {
                  idSucursal: formValue.idSalida, 
                  cantidad: parseFloat(stockSalida.cantidad)-parseFloat(formValue.cantidad),
                  _id: stockSalida._id
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
                  }
                })
                .then(r=>{
                  handleClose()
                  dispatch(setAlert({
                    message: 'Stock salida modificado correctamente',
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

    useEffect(()=>{
        if (item) {
            apiClient.get(`/stock/${item?._id}` ,
            {
              headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
              .then(r=>{
                setListStock(r.data.body)
              })
              .catch(e=>dispatch(setAlert({
                message: `${e.response.data.error || 'Ocurrio un error'}`,
                type: 'error'
              })))
        }
    },[item])

    useEffect(()=>{
      formik.setFieldValue('precioLista', (formik.values.precioEfectivo+(formik.values.precioEfectivo*0.2)).toFixed(2))
    },[formik.values.precioEfectivo])

  return (
    <div>
        <InputSelect label={"Sucursal de salida"} type='text' name='sucursal'  onChange={(id, item)=>formik.setFieldValue('idSalida', id)} />
        <InputSelect label={"Sucursal de destino"} type='text' name='sucursal'  onChange={(id, item)=>formik.setFieldValue('idDestino', id)} />
        {formik.values?.idSalida !== '' && <label style={{marginBottom: 25, color: `${process.env.TEXT_COLOR}`}} >Stock disponible : {listStock.find(stock => stock.idSucursal === formik.values.idSalida).cantidad || 0} unidades</label>}
        <Input label={"Cantidad"} type='number' name='cantidad' value={formik.values.cantidad} onChange={formik.handleChange} required={true} />
        <Input label={"Precio efectivo"} type='number' name='precioEfectivo' value={formik.values.precioEfectivo} onChange={formik.handleChange} prefix={'$'} />
        <Input label={"Precio lista"} type='number' name='precioLista' value={formik.values.precioLista} onChange={formik.handleChange}  prefix={'$'} />
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
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
