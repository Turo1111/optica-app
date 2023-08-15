import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import EmptyList from '../EmptyList'
import apiClient from '@/utils/client'

export default function InfoVenta({_id, cliente, fecha, sucursal, tipoPago, total, subTotal, descuento, empleado, orden, token, obraSocialDescripcion, dineroIngresado}) {

    const [productos, setProductos] = useState([])

    useEffect(()=>{
        if (_id) {
            apiClient.get(`/lineaventa/${_id}` ,
            {
              headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
              .then(r=>{
                console.log(r.data.body);
                setProductos(r.data.body)
              })
              .catch(e=>dispatch(setAlert({
                message: 'Hubo un error inesperado al cargar los stock',
                type: 'error'
              })))
        }
    },[_id])

  return (
    <div style={{display: 'flex', flexDirection: 'column', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} >
        <div>
            <Tag>CLIENTE : {cliente}</Tag>
            <Tag>FECHA : {fecha}</Tag>
            <Tag>SUCURSAL : {sucursal}</Tag>
            <Tag>EMPLEADO : {empleado}</Tag>
            {obraSocialDescripcion && <Tag>OBRA SOCIAL : {obraSocialDescripcion}</Tag>}
            {obraSocialDescripcion && <Tag>NUMERO DE ORDEN : {orden.numero}</Tag>}
            <Tag>TIPO DE PAGO : {tipoPago.descripcion}</Tag>
            <Tag>DINERO INGRESADO : $ {dineroIngresado}</Tag>
            {tipoPago.banco && <Tag>BANCO : {tipoPago.banco} {tipoPago.cuotas} cuotas</Tag>}
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
          <Container1>
            <Container2>
              <ul style={{margin: 0, flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0, overflowY: scroll }}>
                  {
                    productos.length === 0 ?
                    <div>No hay productos</div>
                    :
                    productos.map((item, index) => (
                      <div>
                        <Tag>{item.producto}</Tag>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <Tag style={{fontWeight: 400, margin: 0}}>{item.cantidad} unidades</Tag>
                          <Tag style={{fontWeight: 400, margin: 0}}>$ {item.total}</Tag>
                        </div>
                      </div>
                    ))
                  }
                </ul>
            </Container2>
          </Container1>
        </div>
          <Tag style={{textAlign: 'end'}} >SUB-TOTAL : $ {subTotal}</Tag>
          <Tag style={{textAlign: 'end'}} >TOTAL : $ {total}</Tag>
    </div>
  )
}

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