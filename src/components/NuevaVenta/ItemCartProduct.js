import React from 'react'
import styled from 'styled-components'
import {FaInfo} from 'react-icons/fa'
import {MdEdit} from 'react-icons/md'
import { BsTrash } from 'react-icons/bs'
import InputQty from '../InputQty'

export default function ItemCartProduct({item, changeCart, deleteItem, tipoPago}) {

  return (
    <Container >
            <IconWrapper bg={process.env.RED_ALERT} onClick={()=>deleteItem(item._id)}>
                <BsTrash/>
            </IconWrapper>
            <Title color={process.env.TEXT_COLOR}>{item.descripcion}</Title>
            <InputQty 
                qty={item.cantidad} 
                total={item.total} 
                downQty={()=>changeCart({...item, 
                    cantidad: ((item.cantidad > 1) ? item.cantidad-1 : item.cantidad), 
                    total: (item.cantidad > 1 ? 
                            item.descuento !== undefined ? 
                            ((item.cantidad-1)*item.precioEfectivo)-(((item.cantidad-1)*item.precioEfectivo)*(item.descuento/100)) 
                            : 
                            (item.cantidad-1)*item.precioEfectivo 
                        : item.total
                    )
                })} 
                upQty={()=>{
                    changeCart({...item, 
                        cantidad: item.stock >= item.cantidad+1 ? (item.cantidad+1) : item.cantidad, 
                        total: item.stock >= item.cantidad+1 ? 
                                item.descuento !== undefined ? 
                                    ((item.cantidad+1)*item.precioEfectivo)-(((item.cantidad+1)*item.precioEfectivo)*(item.descuento/100)) 
                                    : 
                                    (item.cantidad+1)*item.precioEfectivo 
                            : item.total
                        
                    })
                }} 
            />
    </Container>
  )
}

const Container = styled.li `
    list-style: none;
    padding: 5px 15px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    :hover{
        background-color: #F9F5F6;
    }
    @media only screen and (max-width: 1024px) {
        padding: 10px 5px;
    }
`

const Title = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 5px;
    color: ${props=>props.color};
    @media only screen and (max-width: 1024px) {
        font-size: 14px;
    }
`
const Tag = styled.h2 `
    font-size: 16px;
    padding: 0 15px;
    color: ${props=>props.color};
    @media only screen and (max-width: 445px) {
        font-size: 12px;
    }
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    color: ${props=>props.bg || '#fff'};
    padding: 15px;
    :hover{
        background-color: ${props=>props.hover || '#d9d9d9'};
    }
    @media only screen and (max-width: 1024px) {
        font-size: 18px;
        padding: 5px;
    }
`