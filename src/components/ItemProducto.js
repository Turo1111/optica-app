import React from 'react'
import styled from 'styled-components'
import {FaInfo} from 'react-icons/fa'
import {MdEdit} from 'react-icons/md'
import {BiTransfer} from 'react-icons/bi'

export default function ItemProducto({handleOpenInfoModal, item, handleOpenEditModal, handleOpenTransferModal}) {
  return (
    <Container >
        <div >
            <Title color={process.env.TEXT_COLOR}>{item.descripcion}</Title>
            <div style={{display: 'flex'}}>
                <Tag color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 500}}>Categoria :</label> {item.categoria}
                </Tag>
                <Tag color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 500}}>Marca :</label> {item.marca || 'No definido'}
                </Tag>
                <Tag color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 500}}>Color :</label> {item.color || 'No definido'}
                </Tag>
                <Tag color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 500}}>Precio general :</label> ${item.precioGeneral || 'No definido'}
                </Tag>
            </div>
        </div>
        <div style={{display: 'flex'}}>
            <IconWrapper bg={'#8294C4'} hover={'#637195'}  onClick={handleOpenInfoModal}>
                <FaInfo/>
            </IconWrapper>
            <IconWrapper bg={'#FCDDB0'} hover={'#E1BA82'} onClick={handleOpenEditModal}>
                <MdEdit/>
            </IconWrapper>
            <IconWrapper bg={'#A2CDB0'} hover={'#85A389'} onClick={handleOpenTransferModal}>
                <BiTransfer/>
            </IconWrapper>
        </div>
    </Container>
  )
}

const Container = styled.li `
    list-style: none;
    padding: 10px 25px;
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    :hover{
        background-color: #F9F5F6;
    }
    @media only screen and (max-width: 445px) {
        padding: 10px 5px;
    }
`

const Title = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 5px;
    color: ${props=>props.color};
    @media only screen and (max-width: 445px) {
        font-size: 14px;
    }
`
const Tag = styled.label `
    font-size: 16px;
    padding: 0 15px;
    color: ${props=>props.color};
    @media only screen and (max-width: 700px) {
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