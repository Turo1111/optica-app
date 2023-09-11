import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import EmptyList from '../EmptyList'
import apiClient from '@/utils/client'
import Loading from '../Loading'
import Table from '../Table'
import { useDate } from '@/hooks/useDate'

export default function InfoVenta({_id, cliente, fecha, sucursal, tipoPago, total, subTotal, descuento, empleado, orden, token, obraSocialDescripcion, dineroIngresado}) {

    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(false)
    const {date} = useDate(fecha)

    const getLV = () => {
      if (_id) {
        setLoading(true)
          apiClient.get(`/lineaventa/${_id}` ,
          {
            headers: {
              Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
            }
          })
            .then(r=>{
              setLoading(false)
              setProductos(r.data.body)
            })
            .catch(e=>dispatch(setAlert({
              message: `${e.response.data.error || 'Ocurrio un error'}`,
              type: 'error'
            })))
      }
    }

    useEffect(()=>{
      getLV()
    },[_id])

  return (
    <div style={{display: 'flex', flexDirection: 'column', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} >
        <div>
            <Tag>CLIENTE : {cliente}</Tag>
            <Tag>FECHA : {date}</Tag>
            <Tag>SUCURSAL : {sucursal}</Tag>
            <Tag>EMPLEADO : {empleado}</Tag>
            {obraSocialDescripcion && <Tag>OBRA SOCIAL : {obraSocialDescripcion}</Tag>}
            {obraSocialDescripcion && <Tag>NUMERO DE ORDEN : {orden.numero}</Tag>}
            <Tag>TIPO DE PAGO : {tipoPago.descripcion}</Tag>
            <Tag>DINERO INGRESADO : $ {dineroIngresado}</Tag>
            {tipoPago.banco && <Tag>BANCO : {tipoPago.banco} {tipoPago.cuotas} cuotas</Tag>}
        </div>
        <Table data={productos} columns={columns} maxHeight={false} onClick={()=>''} />
          <Tag style={{textAlign: 'end'}} >SUB-TOTAL : $ {subTotal}</Tag>
          <Tag style={{textAlign: 'end'}} >TOTAL : $ {total}</Tag>
          <Tag style={{textAlign: 'end'}} >FALTANTE A PAGAR : $ {(parseFloat(total)-parseFloat(dineroIngresado)).toFixed(2)}</Tag>
    </div>
  )
}

const columns = [
  { label: 'Producto', field: 'descripcion', width: '50%' },
  { label: 'Cantidad', field: 'cantidad', width: '20%', align: 'center' },
  { label: 'Total', field: 'total', width: '30%', align: 'center', price: true },
];

const Tag = styled.h5 `
    font-size: 16px;
    padding: 0 15px;
    font-weight: 500;
    margin: 10px 0;
    color: ${process.env.TEXT_COLOR};
    @media only screen and (max-width: 768px) {
      font-size: 14px;
    }
`

const Container1 = styled.main `
    display: flex;
    flex: 1;
    padding: 5px;
    @media only screen and (max-width: 768px) {
        padding: 0
    }
`

const Container2 = styled.main `
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: #EEEEEE;
    padding: 15px;
    border-radius: 25px;
    @media only screen and (max-width: 768px) {
        padding: 5px;
        border-radius: 0px;
    }
`

const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  overflow-y: scroll;
`