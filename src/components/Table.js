import React from 'react'
import styled from 'styled-components'

export default function Table({data = [], columns, onClick}) {
  return (
    <ul style={{padding: 0}}>
        <TableHeader color={process.env.TEXT_COLOR}>
            {columns.map((column, index) => (
              <div key={index} style={{ flexBasis: column.width, textAlign: column.align }}>
                {column.label}
              </div>
            ))}
          {/* <div style={{flexBasis: '40%'}}>Sucursal</div>
          <div style={{flexBasis: '10%'}}>Stock</div>
          <div style={{flexBasis: '25%', textAlign: 'center'}}>Precio Efectivo</div>
          <div style={{flexBasis: '25%', textAlign: 'center'}}>Precio Lista</div> */}
        </TableHeader>
        {
            data.length === 0 ?
                <TableRow>
                    <div style={{textAlign: 'center'}} data-label="Sucursal">NO HAY ELEMENTOS</div>
                </TableRow>
            :
            data.map((item,index)=>(
                <TableRow key={index} onClick={()=>onClick(item)} color={process.env.TEXT_COLOR} >
                    {columns.map((column, columnIndex) => (
                      <div
                        key={columnIndex}
                        style={{ flexBasis: column.width, textAlign: column.align }}
                        data-label={column.label}
                      >
                        {item[column.field]}
                      </div>
                    ))}
                   {/*  <div style={{flexBasis: '40%'}} data-label="Sucursal">{item.sucursal}</div>
                    <div style={{flexBasis: '10%'}} data-label="Stock">{item.cantidad}</div>
                    <div style={{flexBasis: '25%'}} data-label="Precio Efectivo">${item.precioEfectivo}</div>
                    <div style={{flexBasis: '25%'}} data-label="Precio Lista">${item.precioLista}</div> */}
                </TableRow>
            ))
        }
    </ul>
  )
}

const TableHeader = styled.li `
    border-radius: 3px;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: ${props=>props.color};
    background-color: #F9F5F6;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
`

const TableRow = styled.li `
    border-radius: 3px;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: ${props=>props.color};
    background-color: #ffffff;
    cursor: ${props=>props.onClick && 'pointer'};
    :hover{
        background-color: ${props=>props.onClick && '#F9F5F6'};
    };
`

