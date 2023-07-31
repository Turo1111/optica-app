import React from 'react'
import styled from 'styled-components'

export default function InputQty ({large, upQty, downQty, qty ,total}) {
  return (
    <Container>
        <ContainerInput>
            <UpDown style={{color: `${process.env.TEXT_COLOR}`}} large={large} onClick={downQty}>-</UpDown>
            <Qty style={{color: `${process.env.TEXT_COLOR}`}} large={large}>{qty}</Qty>
            <UpDown style={{color: `${process.env.TEXT_COLOR}`}} large={large} onClick={upQty} >+</UpDown>
        </ContainerInput>
        <Total style={{color: `${process.env.TEXT_COLOR}`}} large={large}>$ {total}</Total>
    </Container>
  )
}

const Container = styled.div `
    display: block;
    padding: 5px;
    max-width: 120px;
    min-width: 100px;
`

const UpDown = styled.div `
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${props=>props.large ? '40px' : '22px'};
    padding: 5px;
    min-width: 25px;
    cursor: pointer;
    :hover{
        background-color: #d9d9d9;
    }
`

const Qty = styled.div `
    font-size: ${props=>props.large ? '36px' : '18px'};
    padding: 5px;
    font-weight: 600;
`

const ContainerInput = styled.div `
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Total = styled.h2 `
    font-size: ${props=>props.large ? '18px' : '16px'};
    text-align: center;
    margin: 5px;
    @media only screen and (max-width: 1024px) {
        font-size: 12px;
    }
`