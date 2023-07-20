import React from 'react'
import styled from 'styled-components'
import Table from '../Table'

export default function InfoCliente({nombreCompleto, telefono, dni, senia}) {
    console.log("senia",senia)
  return (
    <div style={{ padding: 5}}>
        <Title color={process.env.TEXT_COLOR}>Nombre Completo : {nombreCompleto}</Title>
        <Tag color={process.env.TEXT_COLOR}> Telefono : {telefono}</Tag>
        <Tag color={process.env.TEXT_COLOR}> DNI : {dni}</Tag>
        <Tag color={process.env.TEXT_COLOR}> Seña activa : </Tag>
        {
            !senia ? <Title color={process.env.TEXT_COLOR}>NO TIENE SENIA ACTIVA</Title> :
            <Table data={[{fecha: senia?.fecha, saldo: senia?.saldo}]} columns={columnsSenia} onClick={(item)=>console.log("")} 
            />
        }
    </div>
  )
}

const columnsSenia = [
    { label: 'Fecha', field: 'fecha', width: '70%' },
    { label: 'Saldo', field: 'saldo', width: '30%', align: 'center' },
];


const Title = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 5px 0;
    color: ${props=>props.color};
    @media only screen and (max-width: 425px) {
        font-size: 14px;
    }
`

const Tag = styled.h2 `
    font-size: 16px;
    font-weight: 500;
    color: ${props=>props.color};
    @media only screen and (max-width: 425px) {
        font-size: 14px;
    }
`
