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

export default function FilterChartData({handleClose, handleFilter}) {

    const [loading, setLoading] = useState(false)
    const [selectedTipoFecha, setSelectedTipoFecha] = useState(undefined)
    const [selectedTipoDato, setSelectedTipoDato] = useState(undefined)
    const user = useAppSelector(getUser);
    const dispatch = useAppDispatch();

    const tipoFecha = [
        { _id: 'ANUAL', descripcion: 'Anual' },
        { _id: 'MENSUAL', descripcion: 'Mensual' },
        { _id: 'SEMANAL', descripcion: 'Semanal' },
    ];

    const tipoDato = [
        { _id: 'TOTAL_SUC', descripcion: 'Total de ventas por sucursal' },
        { _id: 'TOTAL_DI_COMPRA', descripcion: 'Total de ventas' },
        { _id: 'TOTAL_TP', descripcion: 'Total de ventas por tipo de pago' },
        { _id: 'TOTAL_OS', descripcion: 'Total de ventas por obra social' },
    ];

    const applyFilter = () => {
      /* console.log(selectedTipoFecha,selectedTipoDato);
      return */
      if (selectedTipoFecha?.length === 0 || selectedTipoFecha === undefined) {
        dispatch(setAlert({
          message: `Seleccione al menos un tipo de fecha`,
          type: 'error'
        }))
        return
      }
      if (selectedTipoDato?.length === 0 || selectedTipoDato === undefined) {
        dispatch(setAlert({
          message: `Seleccione al menos una tipo de dato`,
          type: 'error'
        }))
        return
      }
      handleFilter({tipoFecha: selectedTipoFecha[0]._id, tipoDato: selectedTipoDato[0]._id})
      handleClose()
    }

  return (
    <div style={{margin: '15px 0'}}>
        <div>
            <TitleFilter>Tipo de fecha</TitleFilter>
            <CheckListGroup items={tipoFecha} onItemChange={setSelectedTipoFecha} multiple={false} />
        </div>
        <div>
            <TitleFilter>Tipo de datos</TitleFilter>
            <CheckListGroup items={tipoDato} onItemChange={setSelectedTipoDato} multiple={false} />
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