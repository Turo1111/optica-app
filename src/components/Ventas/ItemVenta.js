import useConvertToBuenosAiresTime from '@/hooks/useConvertToBuenosAiresTime'
import { useDate } from '@/hooks/useDate'
import React from 'react'
import { BiPrinter } from 'react-icons/bi'
import { FaInfo } from 'react-icons/fa'
import { MdOutlineAttachMoney } from 'react-icons/md'
import styled from 'styled-components'

export default function ItemVenta({cantidadProductos, cliente, fecha, sucursal, tipoPago, total, handleOpenInfo, dineroIngresado, handleOpenSaldo, handleOpenPrint}) {

    const {date} = useDate(fecha)

  return (
    <Container>
        <ContainerData>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
                <Title>{cliente}</Title>
                <Fecha>{date}</Fecha>
            </div>
            <ContainerData2>
                <Tag>{sucursal}</Tag>
                <Tag>{tipoPago?.descripcion}</Tag>
            </ContainerData2>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
                <ContainerData2>
                    <Tag style={{}}>{cantidadProductos} Productos</Tag>
                </ContainerData2>
                <Tag>$ {total} {`( INGRESADO $ ${dineroIngresado} )`} </Tag>
            </div>
        </ContainerData>
        <div style={{display: 'flex'}}>
            <IconWrapper bg={'#8294C4'} hover={'#637195'}  onClick={handleOpenInfo}>
                <FaInfo/>
            </IconWrapper>
            <IconWrapper bg={'#AAC8A7'} hover={'#94A684'}  onClick={handleOpenSaldo}>
                <MdOutlineAttachMoney/>
            </IconWrapper>
            <IconWrapper bg={'#EFD595'} hover={'#C08261'}  onClick={handleOpenPrint}>
                <BiPrinter/>
            </IconWrapper>
        </div>
    </Container>
  )
}

const Container = styled.li `
    list-style: none;
    padding: 5px 25px;
    margin: 10px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    flex: 1;
    :hover{
        background-color: #F9F5F6;
    }
    @media only screen and (max-width: 1024px) {
        padding: 10px 5px;
    }
`

const ContainerData = styled.div `
    flex: 1;
    padding: 0 25px;
    @media only screen and (max-width: 600px) {
        padding: 0;
    }
`

const ContainerData2 = styled.div `
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media only screen and (max-width: 600px) {
        display: none;
    }
`

const Title = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 5px;
    color: ${process.env.TEXT_COLOR};
    @media only screen and (max-width: 600px) {
        font-size: 14px;
    }
`
const Tag = styled.h5 `
    font-size: 16px;
    padding: 0 15px;
    font-weight: 500;
    margin: 5px;
    color: ${process.env.TEXT_COLOR};
    @media only screen and (max-width: 600px) {
        font-size: 14px;
    }
`

const Fecha = styled.h5 `
    font-size: 16px;
    padding: 0 15px;
    font-weight: 500;
    margin: 5px;
    color: ${process.env.TEXT_COLOR};
    @media only screen and (max-width: 600px) {
        display: none;
    }
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    color: #fff;
    background-color: ${props=>props.bg || '#fff'};
    padding: 15px;
    :hover{
        background-color: ${props=>props.hover || '#d9d9d9'};
    }
    @media only screen and (max-width: 445px) {
        font-size: 18px;
    }
`