import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import CheckboxGroup from '../CheckBoxGroup'
import CheckListGroup from '../CheckBoxGroup'
import Button from '../Button';
import Input from '../Input';
import { getUser } from '@/redux/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import apiClient from '@/utils/client';
import Loading from '../Loading';
import { setAlert } from '@/redux/alertSlice';
import { useInputValue } from '@/hooks/useInputValue';

export default function FilterData({handleClose, handleFilter, filter}) {

    const [sucursales, setSucursales] = useState([])
    const [selectedSucursales, setSelectedSucursales] = useState([]);
    const [selectedTipoFecha, setSelectedTipoFecha] = useState([]);
    const [selectedTipoPago, setSelectedTipoPago] = useState([]);
    const [obraSocial, setObraSocial] = useState([])
    const [selectedObraSocial, setSelectedObraSocial] = useState([]);
    const [loading, setLoading] = useState(false)
    const user = useAppSelector(getUser);
    const dispatch = useAppDispatch();
    const fechaInicio = useInputValue('','')
    const fechaFinal = useInputValue('','')

    const tipoFecha = [
        { _id: 0, descripcion: 'Anual' },
        { _id: 1, descripcion: 'Mensual' },
        { _id: 2, descripcion: 'Semanal' },
        { _id: 3, descripcion: 'Hoy' },
    ];

    const tipoPago = [
        { _id: 4, descripcion: 'EFECTIVO' },
        { _id: 5, descripcion: 'TARJETA' },
        { _id: 6, descripcion: 'EFECTIVO Y TARJETA' },
        { _id: 7, descripcion: 'CUENTA CORRIENTE' },
    ];

    const getSucursal = () => {
      setLoading(true)
      apiClient.get('/sucursal' ,
      {
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
        .then(r => {
          setSucursales((prevData)=>{
            setLoading(false)
            console.log(r.data.body);
            return r.data.body
          })
        })
        .catch(e => {
          console.log(e);
          dispatch(setAlert({
          message: `${e.response?.data.error || 'Ocurrio un error'}`,
          type: 'error'
          }))}
        )
    }
  
    useEffect(() => {
      getSucursal()
    }, [user.token])

    function getOBS() {
      setLoading(true)
      apiClient.get('/obrasocial' ,
      {
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
      .then(r=>{
        setObraSocial(r.data.body)
        setLoading(false)
      })
      .catch(e=>dispatch(setAlert({
        message: `${e.response?.data.error || 'Ocurrio un error'}`,
        type: 'error'
      })))
    }

    useEffect(()=>{
      getOBS()
    },[user.token])

    const applyFilter = () => {
      console.log(selectedSucursales);
      console.log(selectedTipoFecha);
      console.log(selectedTipoPago);
      console.log(selectedObraSocial);
      console.log(fechaInicio, fechaFinal);
      if (selectedSucursales.length === 0) {
        dispatch(setAlert({
          message: `Seleccione al menos una sucursal`,
          type: 'error'
        }))
        return
      }
      if (selectedTipoFecha.length === 0 && (fechaFinal === '' && fechaInicio === '')) {
        dispatch(setAlert({
          message: `Seleccione al menos un tipo de fecha`,
          type: 'error'
        }))
        return
      }
      if (selectedTipoPago.length === 0) {
        dispatch(setAlert({
          message: `Seleccione al menos una tipo de pago`,
          type: 'error'
        }))
        return
      }
      const currentDate = new Date();
      let fechaInicioTP = '';
      let fechaFinalTP = '';
      
      if (selectedTipoFecha.length !== 0) {
        switch (selectedTipoFecha[0].descripcion) {
          case 'Mensual':
            fechaInicioTP = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            fechaFinalTP = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            break;
          case 'Anual':
            fechaInicioTP = new Date(currentDate.getFullYear(), 0, 1);
            fechaFinalTP = new Date(currentDate.getFullYear(), 11, 31);
            break;
          case 'Hoy':
            fechaInicioTP = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
            fechaFinalTP = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
            break;
          case 'Semanal':
            // Calcula la fecha de inicio (primer día de la semana) y final (último día de la semana)
            const firstDayOfWeek = currentDate.getDate() - currentDate.getDay();
            const lastDayOfWeek = firstDayOfWeek + 6;
            fechaInicioTP = new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDayOfWeek);
            fechaFinalTP = new Date(currentDate.getFullYear(), currentDate.getMonth(), lastDayOfWeek);
            break;
          default:
            // Tipo de pago desconocido
            break;
        }
      }
      console.log({
        fechaInicio: fechaInicio.value === '' ? fechaInicioTP : new Date(fechaInicio.value),
        fechaFinal: fechaFinal.value === '' ? fechaFinalTP : new Date(fechaFinal.value),
        sucursales: selectedSucursales.map(item => item._id),
        obraSociales: selectedObraSocial.map(item => item._id),
        tipoPago: selectedTipoPago.map(item => item.descripcion),
      });
      handleFilter({
        fechaInicio: fechaInicio.value === '' ? fechaInicioTP : new Date(fechaInicio.value),
        fechaFinal: fechaFinal.value === '' ? fechaFinalTP : new Date(fechaFinal.value),
        sucursales: selectedSucursales.map(item => item._id),
        obraSociales: selectedObraSocial.map(item => item._id),
        tipoPago: selectedTipoPago.map(item => item.descripcion),
      })
      handleClose()
    }

  return (
    <div style={{margin: '15px 0'}}>
        <div>
            <TitleFilter>Tipo de fecha</TitleFilter>
            <CheckListGroup items={tipoFecha} onItemChange={setSelectedTipoFecha} multiple={false} />
        </div>
        <div>
            <TitleFilter>Fecha</TitleFilter>
            <Input label={"Fecha Inicio"} type='date' name='fechaInicio' value={fechaInicio.value} onChange={fechaInicio.onChange}  />
            <Input label={"Fecha Final"} type='date' name='fechaFinal' value={fechaFinal.value} onChange={fechaFinal.onChange}  />
        </div>
        <div>
            <TitleFilter>Sucursal</TitleFilter>
            <CheckListGroup items={sucursales} onItemChange={setSelectedSucursales} multiple={true} />
        </div>
        <div>
            <TitleFilter>Tipo de pago</TitleFilter>
            <CheckListGroup items={tipoPago} onItemChange={setSelectedTipoPago} multiple={true} />
        </div>
        <div>
            <TitleFilter>Obra social</TitleFilter>
            <CheckListGroup items={obraSocial} onItemChange={setSelectedObraSocial} multiple={true} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 15}}>
          {
            loading ? 
            <Loading />:
            <>
              <Button text={'CANCELAR'} onClick={handleClose}/>
              <Button text={'ACEPTAR'} onClick={applyFilter}/>
            </>
          }
        </div>
    </div>
  )
}

const TitleFilter = styled.h5 `
    font-size: 18px;
    padding: 0 15px;
    font-weight: 500;
    margin: 10px 0;
    color: ${process.env.TEXT_COLOR};
`