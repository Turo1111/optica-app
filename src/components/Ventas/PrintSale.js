import React, { useEffect, useState } from 'react'

import html2pdf from 'html2pdf.js';
import styled from 'styled-components';
import Table from '../Table';
import Button from '../Button';
import Loading from '../Loading';
import { useDate } from '@/hooks/useDate';
import apiClient from '@/utils/client';
import Confirm from '../Confirm';

export default function PrintSale({
    _id,
    id,
    cliente,
    fecha,
    obraSocial,
    orden,
    dineroIngresado,
    tipoPago,
    descuento,
    subTotal,
    total,
    carrito,
    onClose,
    useSenia,
    token
}) {

  const [lineaVenta, setLineaVenta] = useState([])
  const [loading, setLoading] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)

  function generatePdf() {
    const element = document.getElementById('print');
    html2pdf().from(element).save(`venta-${cliente}-${fecha}.pdf`);
    onClose()
  }

  useEffect(()=>{
    if (carrito.length === 0) {
      setLoading(true)
        apiClient.get(`/lineaventa/${_id}` ,
        {
          headers: {
            Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
          .then(r=>{
            setLoading(false)
            setLineaVenta(r.data.body)
          })
          .catch(e=>dispatch(setAlert({
            message: `${e.response.data.error || 'Ocurrio un error'}`,
            type: 'error'
          })))
    }
  },[_id])

  if (loading) {
    return <Loading/>
  }

  return (
    <>
      <ContainerPrint id={id} >
          <div>
              <Tag>CLIENTE : {cliente}</Tag>
              <Tag>FECHA : {fecha}</Tag>
              {obraSocial && <Tag>OBRA SOCIAL : {obraSocial}</Tag>}
              {obraSocial && <Tag>NUMERO DE ORDEN : {orden}</Tag>}
              <Tag>TIPO DE PAGO : {tipoPago.descripcion}</Tag>
              <Tag>{useSenia ? 'SEÑA' : 'DINERO INGRESADO'} : $ {dineroIngresado}</Tag>
              {tipoPago.banco && <Tag>BANCO : {tipoPago.banco} {tipoPago.cuotas} cuotas</Tag>}
          </div>
          <div>
          <Table data={carrito.length === 0 ? lineaVenta : carrito} columns={columns} maxHeight={false} onClick={()=>''} />
          </div>
          <Tag style={{textAlign: 'end'}} >DESCUENTO : $ {descuento}</Tag>
          <Tag style={{textAlign: 'end'}} >SUB-TOTAL : $ {subTotal}</Tag>
          <Tag style={{textAlign: 'end'}} >TOTAL : $ {total}</Tag>
          <Tag style={{textAlign: 'end'}} >FALTANTE A PAGAR : $ {(parseFloat(total)-parseFloat(dineroIngresado)).toFixed(2)}</Tag>
      </ContainerPrint>
      <div style={{display: 'flex', justifyContent: 'space-between'}} >
          <Button text={'Imprimir'} onClick={()=>setOpenConfirm(true)}  />
          <Button text={'Aceptar'} onClick={onClose}  />
      </div>
      
      {
          openConfirm &&
          <Confirm
            confirmAction={generatePdf}
            handleClose={()=>setOpenConfirm(false)}
            loading={loading}
            open={openConfirm}
          />
        }
    </>
  )
}
const ContainerPrint = styled.div `
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: scroll;
  white-space: nowrap;
  text-overflow: ellipsis
`

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


