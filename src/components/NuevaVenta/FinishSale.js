import { useDate } from '@/hooks/useDate';
import React from 'react'
import styled from 'styled-components'
import Button from '../Button';
import html2pdf from 'html2pdf.js';
import Table from '../Table';
import PrintSale from '../Ventas/PrintSale';

export default function FinishSale({venta, onClose}) {
    const {date: fecha} = useDate(venta.fecha)
    
  return (
    <div>
        <PrintSale id='print' onClose={onClose}
            cliente={venta.cliente}
            fecha={fecha}
            obraSocial={venta.obraSocial}
            orden={venta.orden}
            tipoPago={venta.tipoPago}
            dineroIngresado={venta.dineroIngresado}
            carrito={venta.carrito}
            descuento={venta.descuento}
            subTotal={venta.subTotal}
            total={venta.total}
            useSenia={venta.useSenia}
        />
    </div>
  )
}


const columns = [
    { label: 'Producto', field: 'descripcion', width: '50%' },
    { label: 'Cantidad', field: 'cantidad', width: '20%', align: 'center' },
    { label: 'Total', field: 'total', width: '30%', align: 'center' },
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
  margin: 0;
`
