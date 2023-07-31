import React, { useEffect, useState } from 'react'
import InputQty from '../InputQty'
import styled from 'styled-components'
import Button from '../Button'
import apiClient from '@/utils/client'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'

export default function AddProduct({item, addCart, onClose, user}) {

    const [qty, setQty] = useState(1)
    const [stock, setStock] = useState(undefined)
    const [totalEfectivo, setTotalEfectivo] = useState(0)
    const [totalTarjeta, setTotalTarjeta] = useState(0)
    const dispatch = useAppDispatch();

    const addItemCart = () => {
        
        if ( stock !== undefined && stock.cantidad >= qty) {
            addCart({...item,cantidad: qty, totalEfectivo, totalTarjeta, precioEfectivo:stock.precioEfectivo, precioLista:stock.precioLista, stock: stock.cantidad })
        }else{
            dispatch(setAlert({
                message: 'Sucursal sin stock disponible',
                type: 'error'
            }))

        }
    }

    useEffect(()=>{
        if (stock) {
            if (qty===1) {
                setTotalEfectivo((stock.precioEfectivo).toFixed(2))
                setTotalTarjeta((stock.precioLista).toFixed(2))
            }else{
                setTotalEfectivo((qty*stock.precioEfectivo).toFixed(2))
                setTotalTarjeta((qty*stock.precioLista).toFixed(2))
            }
        }
    },[qty,stock])

    useEffect(()=>{
        apiClient.get(`/stock/${item._id}`,{
            headers: {
              Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
            }
          })
        .then((r)=>setStock(r.data.body.filter(item=>item.sucursal===user.sucursal)[0]))
        .catch(e=>console.log(e))
    },[item._id])

  return (
    <div>
        <Title color={process.env.TEXT_COLOR}>{item?.descripcion || 'No definido'}</Title>
        <SubTitle color={process.env.TEXT_COLOR}>Precio efectivo: $ {stock?.precioEfectivo || 'No hay stock disponible en la sucursal'}</SubTitle>
        <SubTitle color={process.env.TEXT_COLOR}>Precio tarjeta: $ {stock?.precioLista || 'No hay stock disponible en la sucursal'}</SubTitle>
        <SubTitle color={process.env.TEXT_COLOR}>Stock disponible: {stock?.cantidad || 'No hay stock disponible en la sucursal'}</SubTitle>
        <div style={{display: 'flex', justifyContent: 'center'}} >
            <InputQty large={true} 
                qty={qty} 
                upQty={()=> setQty(qty+1)}
                downQty={()=> {qty > 1 && setQty(qty-1)}}
                total={totalEfectivo}
            />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}} >
            <Button text={'Cancelar'} onClick={onClose}  />
            <Button text={'Aceptar'} onClick={addItemCart}  />
        </div>
    </div>
  )
}

const Title = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 5px 0;
    color: ${props=>props.color};
    @media only screen and (max-width: 1024px) {
        font-size: 16px;
    }
    @media only screen and (max-width: 445px) {
        font-size: 14px;
    }
`
const SubTitle = styled.h2 `
    font-size: 16px;
    font-weight: 500;
    margin: 5px 0;
    color: ${props=>props.color};
    @media only screen and (max-width: 1024px) {
        font-size: 16px;
    }
    @media only screen and (max-width: 445px) {
        font-size: 14px;
    }
`
