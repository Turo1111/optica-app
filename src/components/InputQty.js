import React from 'react'
import styled from 'styled-components'

export default function InputQty ({large, upQty, downQty, qty ,total, oferta = false, descuento}) {

  return (
    <Container>
        <ContainerInput>
            <UpDown style={{color: `${process.env.TEXT_COLOR}`}} large={large} onClick={downQty}>-</UpDown>
            <Qty style={{color: `${process.env.TEXT_COLOR}`}} large={large}>{qty}</Qty>
            <UpDown style={{color: `${process.env.TEXT_COLOR}`}} large={large} onClick={upQty} >+</UpDown>
        </ContainerInput>
        <div style={{display: 'flex'}} >
            {oferta && <Total style={{color: `${process.env.TEXT_COLOR}`}} oferta={true} large={large}>$ {total}</Total>}
            <Total style={{color: `${process.env.TEXT_COLOR}`}} large={large}>$ {!oferta ? parseFloat(total).toFixed(2) : (total-(total*(descuento/100))).toFixed(2)}</Total>
        </div>
    </Container>
  )
}

const Container = styled.div `
    display: block;
    padding: 5px;
    max-width: 250px;
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
    justify-content: space-evenly;
    align-items: center;
`

const Total = styled.h2 `
    font-size: ${props=>props.large ? '18px' : '16px'};
    text-align: center;
    margin: 5px;
    text-decoration: ${props => (props.oferta ? 'line-through' : 'none')};
    @media only screen and (max-width: 1024px) {
        font-size: 12px;
    }
`