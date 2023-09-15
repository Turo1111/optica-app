import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import EmptyList from '../EmptyList'
import apiClient from '@/utils/client'
import Loading from '../Loading'
import Table from '../Table'
import { useDate } from '@/hooks/useDate'

export default function InfoVenta({_id, cliente, fecha, sucursal, tipoPago, total, subTotal, descuento, empleado, orden, token, obraSocialDescripcion, dineroIngresado, pago}) {

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
    <Container>
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
        <Table data={pago} columns={columns1} maxHeight={true} onClick={()=>''} title={'LISTA DE PAGOS'} />
        <Table data={productos} columns={columns} maxHeight={false} onClick={()=>''} title={'PRODUCTOS'} />
          <Tag style={{textAlign: 'end'}} >SUB-TOTAL : $ {subTotal}</Tag>
          <Tag style={{textAlign: 'end'}} >TOTAL : $ {total}</Tag>
          <Tag style={{textAlign: 'end'}} >FALTANTE A PAGAR : $ {(parseFloat(total)-parseFloat(dineroIngresado)).toFixed(2)}</Tag>
    </Container>
  )
}

const columns = [
  { label: 'Producto', field: 'descripcion', width: '50%' },
  { label: 'Cantidad', field: 'cantidad', width: '20%', align: 'center' },
  { label: 'Total', field: 'total', width: '30%', align: 'center', price: true },
];

const columns1 = [
  { label: 'Fecha', field: 'fecha', width: '40%', align: 'center', date: true  },
  { label: 'Total', field: 'total', width: '60%', align: 'center'},
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

const Container = styled.div `
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: scroll;
    text-overflow: ellipsis;
    white-space: nowrap
`