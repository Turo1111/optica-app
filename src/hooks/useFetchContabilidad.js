import { setAlert } from '@/redux/alertSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getUser } from '@/redux/userSlice';
import apiClient from '@/utils/client';
import React, { useEffect, useState } from 'react'

export const useFetchContabilidad = (filter, filterChart) => {

    const [total, setTotal] = useState(0)
    const [cantidad, setCantidad] = useState(0)
    const [dineroIngresado, setDineroIngresado] = useState(0)
    const [tipoPago, setTipoPago] = useState([])
    const [porSucursal, setPorSucursal] = useState([])
    const [crecimiento, setCrecimiento] = useState(0)
    const [dataChart, setDataChart] = useState([])
    
    const user = useAppSelector(getUser);
    const dispatch = useAppDispatch();

    const getTotal = () => {
      if (filter) {
        apiClient.post('/venta/total', filter,
          {
            headers: {
              Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
            }
          })
          .then(r => {
            setTotal(r.data.body.total);
            setCantidad(r.data.body.cantidad)
            setTipoPago(r.data.body.tipoPago);
            setPorSucursal(r.data.body.sucursal);
            setCrecimiento(r.data.body.crecimiento)
            console.log("aca",r.data.body);
          })
          .catch(e => {
            dispatch(setAlert({
            message: `${e.response?.data.error || 'Ocurrio un error'}`,
            type: 'error'
            }))}
          )
      }
    };

    const getDineroIngresado = () => {
      if (filter) {
        apiClient.post('/cierrecaja/total', filter,
          {
            headers: {
              Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
            }
          })
          .then(r => {
            setDineroIngresado(r.data.body.total);
            console.log(r.data.body);
          })
          .catch(e => {
            dispatch(setAlert({
            message: `${e.response?.data.error || 'Ocurrio un error'}`,
            type: 'error'
            }))}
          )
      }
    };

    const getDataChart= () => {
      if (filterChart) {
        if(filterChart.tipoFecha === 'ANUAL'){
          apiClient.post('/contabilidad/anual', filterChart,
            {
              headers: {
                Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
            .then(r => {
              setDataChart(r.data.body) 
              console.log("fetch Anual",r.data.body);
            })
            .catch(e => {
              dispatch(setAlert({
              message: `${e.response?.data.error || 'Ocurrio un error'}`,
              type: 'error'
              }))}
            )
        }
        if(filterChart.tipoFecha === 'SEMANAL'){
          apiClient.post('/contabilidad/semana', filterChart,
            {
              headers: {
                Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
            .then(r => {
              setDataChart(r.data.body)  
              console.log("fetch semana",r.data.body);
            })
            .catch(e => {
              dispatch(setAlert({
              message: `${e.response?.data.error || 'Ocurrio un error'}`,
              type: 'error'
              }))}
            )
        }
        if(filterChart.tipoFecha === 'MENSUAL'){
          apiClient.post('/contabilidad/mensual', filterChart,
              {
                headers: {
                  Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
                }
              })
              .then(r => {
                setDataChart(r.data.body)
                console.log("fetch",r.data.body);
              })
              .catch(e => {
                dispatch(setAlert({
                message: `${e.response?.data.error || 'Ocurrio un error'}`,
                type: 'error'
                }))}
              )
        }
      }
    };

    useEffect(()=>{
      getTotal()
      getDineroIngresado()
    },[filter, user.token])

    useEffect(()=>{
      getDataChart()
    },[filterChart, user.token])

  return {total, cantidad, tipoPago, porSucursal, dineroIngresado, crecimiento, dataChart}
}
