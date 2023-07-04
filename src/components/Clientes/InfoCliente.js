import React from 'react'
import styled from 'styled-components'
import Table from '../Table'

export default function InfoCliente({nombreCompleto, telefono, dni}) {
  return (
    <div style={{marginTop: 25}}>
        <Title color={process.env.TEXT_COLOR}>Nombre Completo : {nombreCompleto}</Title>
        <Tag color={process.env.TEXT_COLOR}> Telefono : {telefono}</Tag>
        <Tag color={process.env.TEXT_COLOR}> DNI : {dni}</Tag>
        <Tag color={process.env.TEXT_COLOR}> Seña activa : </Tag>
        <Table data={[{armazon: 5000, lentes: 3000, total: 8000}]} columns={columnsSenia} onClick={(item)=>console.log("algo")} 
        />
    </div>
  )
}

const columnsSenia = [
    { label: 'Armazon', field: 'armazon', width: '30%' },
    { label: 'Lentes', field: 'lentes', width: '20%', align: 'center' },
    { label: 'Observacion', field: 'total', width: '20%', align: 'center' },
];


const Title = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 5px;
    color: ${props=>props.color};
    @media only screen and (max-width: 425px) {
        font-size: 14px;
    }
`

const Tag = styled.h2 `
    font-size: 16px;
    font-weight: 500;
    color: ${props=>props.color};
`
