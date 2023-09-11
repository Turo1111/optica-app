import React, { useEffect, useState } from 'react'
import InputQty from '../InputQty'
import styled from 'styled-components'
import Button from '../Button'
import apiClient from '@/utils/client'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import useFormatArrayString from '@/hooks/useFormatArrayString'
import { useDate } from '@/hooks/useDate'
import Loading from '../Loading'
import { useInputValue } from '@/hooks/useInputValue'
import { useSearch } from '@/hooks/useSearch'
import InputSearch from '../InputSearch'
import Input from '../Input'

export default function AddProduct({item, addCart, onClose, user}) {

    const [qty, setQty] = useState(1)
    const [stock, setStock] = useState(undefined)
    const [oferta, setOferta] = useState(undefined)
    const [total, setTotal] = useState(0)
    const [qtyLente, setQtyLente] = useState(1)
    const [ofertaLente, setOfertaLente] = useState(undefined)
    const [totalLente, setTotalLente] = useState(0)
    const dispatch = useAppDispatch();
    let listObraSocial = useFormatArrayString(item?.obrasSocialesDescuento)
    let {date: fechaHoy} = useDate()
    const [loading, setLoading] = useState(false)
    const [dataLentes, setDataLentes] = useState([])
    const search = useInputValue('','')
    const tag = ["descripcion", "codigo"]
    const listLentes = useSearch(search.value, tag, dataLentes)
    const [lenteSelected, setLenteSelected] = useState(undefined)
    const totalTaller = useInputValue(0,'number')

    const addItemCart = () => {
        if (lenteSelected?._id === '64f0ca05ae80e2477accbc24' && item._id === '64f0c9e9ae80e2477accbc14') {
            dispatch(setAlert({
                message: 'No se puede seleccionar armazon y lente propios en ambos',
                type: 'error'
            }))
            return
        }
        if (item.idCategoria === '64c958035ae46355b5f7df19' && lenteSelected === undefined) {
            dispatch(setAlert({
                message: 'Necesita seleccionar un lente para el armazon',
                type: 'error'
            }))
            return
        }
        if (stock === undefined || stock.cantidad < qty) {
            dispatch(setAlert({
                message: 'Sucursal sin stock disponible',
                type: 'error'
            }))
            return
        }
        if (lenteSelected !== undefined && lenteSelected.stock.cantidad < qtyLente) {
            dispatch(setAlert({
                message: 'Sucursal sin stock en lente disponible',
                type: 'error'
            }))
            return
        }
        addCart({...item,cantidad: qty, 
            totalTaller: totalTaller.value,
            total: oferta !== undefined ? parseFloat(total-(total*(oferta.descuento/100)))+parseFloat(totalTaller.value) : parseFloat(total)+parseFloat(totalTaller.value), 
            idLente: lenteSelected?._id,
            precioEfectivo:stock.precioEfectivo, precioLista:stock.precioLista, stock: stock.cantidad, idStock: stock._id, descuento: oferta ? oferta.descuento : undefined
        })
        if ( lenteSelected !== undefined ) {
            addCart({...lenteSelected,cantidad: qtyLente, 
                total: ofertaLente !== undefined ? totalLente-(totalLente*(ofertaLente.descuento/100)) : totalLente, 
                precioEfectivo:lenteSelected.stock.precioEfectivo, precioLista:lenteSelected.stock.precioLista, stock: lenteSelected.stock.cantidad, idStock: lenteSelected.stock._id, descuento: ofertaLente ? ofertaLente.descuento : undefined
            })
        }
    }

    useEffect(()=>{
        if (stock) {
            if (qty===1) {
                setTotal((stock.precioEfectivo).toFixed(2))
            }else{
                setTotal((qty*stock.precioEfectivo).toFixed(2))
            }
        }
    },[qty,stock])

    useEffect(()=>{
        if (lenteSelected) {
            if (qtyLente===1) {
                setTotalLente((lenteSelected.stock.precioEfectivo).toFixed(2))
            }else{
                setTotalLente((qtyLente*lenteSelected.stock.precioEfectivo).toFixed(2))
            }
        }
    },[qtyLente])


    useEffect(()=>{
        setLoading(true)
        if (item._id !== '64f0c9e9ae80e2477accbc14' ) {
            apiClient.get(`/stock/${item._id}`,{
                headers: {
                  Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
                }
              })
            .then((r)=>{
                setLoading(false)
                setStock(r.data.body.filter(item=>item.sucursal===user.sucursal)[0])
            })
            .catch(e=>dispatch(setAlert({
                message: `${e.response.data.error || 'Ocurrio un error'}`,
                type: 'error'
            })))
            setLoading(true)
            apiClient.get(`/oferta/${item._id}`,{
                headers: {
                  Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
                }
              })
            .then((r)=>{
                setLoading(false)
                setOferta(r.data.body.find(itemOferta=> new Date(itemOferta.fechaInicio) <= fechaHoy && new Date(itemOferta.fechaFinal) >= fechaHoy))})
            .catch(e=>dispatch(setAlert({
                message: `${e.response.data.error || 'Ocurrio un error'}`,
                type: 'error'
            })))
        }
        setStock({
            cantidad: 9999,
            precioEfectivo: 0,
            precioLista: 0
        })
        if (item.idCategoria === '64c958035ae46355b5f7df19') {
            setLoading(true)
            apiClient.get(`/producto/wstock/${user.idSucursal}`,{
                headers: {
                  Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
                }
              })
            .then((r)=>{
                setLoading(false)
                setDataLentes([...r.data.body, {
                    descripcion: 'Lente propio',
                    _id: '64f0ca05ae80e2477accbc24',
                    stock: {
                        cantidad: 9999,
                        precioEfectivo: 0,
                        precioLista: 0
                    },
                    categoria: 'Lente',
                    idCategoria: '64c94598d2bab952ad754b99'
                }])
            })
            .catch(e=>dispatch(setAlert({
                message: `${e.response.data.error || 'Ocurrio un error'}`,
                type: 'error'
            }))) /* */
        }
    },[item._id])

    const getOferta = () => {
        if (lenteSelected) {
            apiClient.get(`/oferta/${lenteSelected._id}`,{
                headers: {
                  Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
                }
              })
            .then((r)=>{
                setLoading(false)
                setOfertaLente(r.data.body.find(itemOferta=> new Date(itemOferta.fechaInicio) <= fechaHoy && new Date(itemOferta.fechaFinal) >= fechaHoy))})
            .catch(e=>dispatch(setAlert({
                message: `${e.response.data.error || 'Ocurrio un error'}`,
                type: 'error'
            })))
        }
    }

    useEffect(()=>{
        getOferta()
    },[lenteSelected])


    if (loading) {
        return <Loading/>
    }

  return (
    <div>
        <div style={{display: 'flex', flexDirection: 'column'}} >
            <div>
                <Title color={process.env.TEXT_COLOR}>{item?.descripcion || 'No definido'}</Title>
                <SubTitle color={process.env.TEXT_COLOR}>Precio efectivo: $ {stock?.precioEfectivo || 'No hay stock disponible en la sucursal'}</SubTitle>
                <SubTitle color={process.env.TEXT_COLOR}>Precio tarjeta: $ {stock?.precioLista || 'No hay stock disponible en la sucursal'}</SubTitle>
                <SubTitle color={process.env.TEXT_COLOR}>Stock disponible: {stock?.cantidad || 'No hay stock disponible en la sucursal'}</SubTitle>
                <SubTitle color={process.env.TEXT_COLOR}>Oferta disponible: {oferta?.descuento || 'No hay oferta disponible en la sucursal'} %</SubTitle>
                <SubTitle color={process.env.TEXT_COLOR}><label style={{fontWeight: 600}}>Descuento con :</label> {listObraSocial || 'No definido'}</SubTitle>
                <div style={{display: 'flex', justifyContent: 'center'}} >
                    <InputQty large={true} 
                        qty={qty} 
                        upQty={()=> setQty(qty+1)}
                        downQty={()=> {qty > 1 && setQty(qty-1)}}
                        total={total}
                        descuento={oferta?.descuento || 0}
                        oferta={oferta !== undefined ? true : false}
                    />
                </div>
            </div>
            {
                item.idCategoria === '64c958035ae46355b5f7df19' &&
                <>
                    <div>
                        <div style={{marginTop: 15}}>
                        <InputSearch placeholder={'Buscar Lente'} width='50%' {...search} />
                        <List>
                            {
                            listLentes.length === 0 ? 
                            <div>
                                no hay lentes creados
                            </div>
                            :
                            listLentes.map((item, index) => (
                                <Title color={process.env.TEXT_COLOR} key={index} 
                                onClick={()=>{
                                    if (item._id !== '64f0ca05ae80e2477accbc24') {
                                        setLenteSelected(item)
                                        setQtyLente(1)
                                        setTotalLente(item.stock.precioEfectivo)
                                        return
                                    }
                                    setLenteSelected({...item, stock: {
                                        cantidad: 9999,
                                        precioEfectivo: 0,
                                        precioLista: 0
                                    }})
                                    setQtyLente(1)
                                    setTotalLente(0)
                                }}
                                active={lenteSelected?._id===item._id}
                                style={{display: 'flex', justifyContent: 'space-between'}}
                                >
                                    <label>{item.descripcion}</label><label>$ {item.stock.precioEfectivo}</label>
                                </Title>
                            ))
                            }
                        </List>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}} >
                        <InputQty large={true} 
                            qty={qtyLente} 
                            upQty={()=> setQtyLente(qtyLente+1)}
                            downQty={()=> {qtyLente > 1 && setQtyLente(qtyLente-1)}}
                            total={totalLente}
                            descuento={ofertaLente?.descuento || 0}
                            oferta={ofertaLente !== undefined ? true : false}
                        />
                    </div>
                    {(lenteSelected?._id === '64f0ca05ae80e2477accbc24' || item._id === '64f0c9e9ae80e2477accbc14') && <Input label={"Precio taller"} type='text' name='totalTaller' value={totalTaller.value} onChange={totalTaller.onChange} prefix={'$'} />}
                </>
            }
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
    background-color: ${props=>props.active ? '#d9d9d9' : 'none'};;
    cursor: pointer;
    padding: 15px 0;
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

const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  padding: 0;
  overflow-y: scroll;
  height: 150px;
`
