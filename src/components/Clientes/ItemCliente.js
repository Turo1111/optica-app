import React from 'react'
import { FaInfo } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import styled from 'styled-components'
import { FaMoneyCheckAlt } from "react-icons/fa";

export default function ItemCliente({_id, nombreCompleto, telefono, dni, handleOpenInfoModal, handleOpenEditModal, handleOpenSeniaModal}) {

  
  return (
    <Container>
        <div>
            <Title color={process.env.TEXT_COLOR}>{nombreCompleto}</Title>
            <Tag color={process.env.TEXT_COLOR}> Telefono : {telefono}</Tag>
            <Tag color={process.env.TEXT_COLOR}> DNI : {dni}</Tag>
            <Tag color={process.env.TEXT_COLOR}> 16 COMPRAS</Tag> 
        </div>
        <div style={{display: 'flex'}}>
            <IconWrapper bg={'#8294C4'} hover={'#637195'}  onClick={()=>handleOpenInfoModal({_id, nombreCompleto, telefono, dni})}>
                <FaInfo/>
            </IconWrapper>
            <IconWrapper bg={'#AAC8A7'} hover={'#637195'}  onClick={()=>handleOpenSeniaModal({_id, nombreCompleto, telefono, dni})}>
                <FaMoneyCheckAlt/>
            </IconWrapper>
            <IconWrapper bg={'#FCDDB0'} hover={'#E1BA82'} onClick={()=>handleOpenEditModal({_id, nombreCompleto, telefono, dni})}>
                <MdEdit/>
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
    @media only screen and (max-width: 445px) {
        display: none;
    }
`
