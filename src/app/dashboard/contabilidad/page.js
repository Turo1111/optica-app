'use client'
import DataCenter from '@/components/Contabilidad/DataCenter'
import DataHeader from '@/components/Contabilidad/DataHeader'
import DataLeft from '@/components/Contabilidad/DataLeft'
import FilterChartData from '@/components/Contabilidad/FilterChartData'
import FilterData from '@/components/Contabilidad/FilterData'
import Modal from '@/components/Modal'
import { useFetchContabilidad } from '@/hooks/useFetchContabilidad'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { getUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import React, { useEffect, useState } from 'react'
import { MdArrowForwardIos } from 'react-icons/md'
import styled from 'styled-components'

export default function Contabilidad() {

    const currentDate = new Date();
    const [openFilter, setOpenFilter] = useState(false)
    const [filter, setFilter] = useState({
        fechaInicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        fechaFinal: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
        sucursales: [],
        obraSociales: [],
        tipoPago: [],
    })
    const [filterChart, setFilterChart] = useState({
      tipoFecha : 'ANUAL',
      tipoDato: 'TOTAL_SUC'
    })
    const [openFilterChart, setOpenFilterChart] = useState(false)

    const {total, cantidad, tipoPago, porSucursal, dineroIngresado, crecimiento, dataChart} = useFetchContabilidad(filter, filterChart)

  return (
    <ContainerMain>
        <div style={{display: 'flex', justifyContent: 'space-around'}} >
            <ItemLista color={process.env.TEXT_COLOR} onClick={()=>setOpenFilter(true)} >Filtros numeros</ItemLista>
            <ItemLista color={process.env.TEXT_COLOR} onClick={()=>setOpenFilterChart(true)} >Filtros grafica</ItemLista>
        </div>
        <DataHeader total={total} cantidad={cantidad} dineroIngresado={dineroIngresado} crecimiento={crecimiento}/>
        <Container>
            <DataLeft  tipoPago={tipoPago} porSucursal={porSucursal}/>
            <DataCenter dataChart={dataChart}/>
        </Container>
        {
            openFilter && 
            <Modal
              open={openFilter}
              title={'FILTROS PARA NUMEROS'}
              height='auto'
              width='50%'
              eClose={()=>setOpenFilter(false)}
            >
              <FilterData handleClose={()=>setOpenFilter(false)} handleFilter={(f)=>setFilter(f)} filter={filter} />
            </Modal>
        }
        {
            openFilterChart && 
            <Modal
              open={openFilterChart}
              title={'FILTROS PARA LA GRAFICA'}
              height='auto'
              width='35%'
              eClose={()=>setOpenFilterChart(false)}
            >
              <FilterChartData handleClose={()=>setOpenFilterChart(false)} handleFilter={(f)=>setFilterChart(f)} />
            </Modal>
        }
    </ContainerMain>
  )
}

const ContainerMain = styled.div `
  overflow-y: scroll;
`

const ItemLista = styled.div `
    list-style: none;
    color: ${process.env.TEXT_COLOR};
    font-size: 22px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    padding: 25px;
    margin: 5px 75px;
    cursor: pointer;
    :hover{
        background-color: #F9F5F6;
    };
    @media only screen and (max-width: 445px) {
        margin: 5px 25px;
        font-size: 26px;
    }
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: ${process.env.TEXT_COLOR};
    padding: 5px;
`

const Container = styled.div `
    display: flex;
    padding: 15px;
    justify-content: space-around;
    @media only screen and (max-width: 1260px) {
       flex-direction: column;
    }
`
