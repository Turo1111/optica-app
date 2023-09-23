import React from 'react'
import styled from 'styled-components'

export default function DataHeader({total, cantidad, dineroIngresado, crecimiento}) {
  return (
    <Container>
        <CardHeader>
            <TitleCardHeader>Total en ventas</TitleCardHeader>
            <Line/>
            <DataCardHeader>$ {total}</DataCardHeader>
        </CardHeader>
        <CardHeader>
            <TitleCardHeader>Dinero ingresado</TitleCardHeader>
            <Line/>
            <DataCardHeader> $ {dineroIngresado} </DataCardHeader>
        </CardHeader>
        <CardHeader>
            <TitleCardHeader>Tasa de crecimiento</TitleCardHeader>
            <Line/>
            <DataCardHeader> {crecimiento} % </DataCardHeader>
        </CardHeader>
        <CardHeader>
            <TitleCardHeader>Cantidad de ventas</TitleCardHeader>
            <Line/>
            <DataCardHeader> {cantidad} </DataCardHeader>
        </CardHeader>
    </Container>
  )
}

const Container = styled.div `
    display: flex; 
    justify-content: space-around;
    align-items: center;
    @media only screen and (max-width: 480px) {
        flex-wrap: wrap;
    }
`

const CardHeader = styled.div `
    background-color: #8294C4;
    min-width: 200px;
    border-radius: 15px;
    padding: 5px 15px;
    @media only screen and (max-width: 900px) {
        min-width: 125px;
        margin: 5px 0;
    }
`

const Line = styled.div `
    border-bottom: 1px solid #fff;
    margin-bottom: 5px;
`

const TitleCardHeader = styled.h5 `
    font-size: 16px;
    color: #fff;
    margin: 10px 0 ;
    font-weight: 600;
    @media only screen and (max-width: 1260px) {
        font-size: 14px;
    }
    @media only screen and (max-width: 900px) {
        font-size: 12px;
    }
`

const DataCardHeader = styled.h5 `
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    margin: 10px 0;
    text-align: center;
    @media only screen and (max-width: 1260px) {
        font-size: 16px;
    }
    @media only screen and (max-width: 900px) {
        font-size: 14px;
    }
`

