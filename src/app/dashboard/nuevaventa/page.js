'use client'
import Button from '@/components/Button'
import NewEditCliente from '@/components/Clientes/NewEditCliente'
import EmptyList from '@/components/EmptyList'
import InputSearch from '@/components/InputSearch'
import InputSelect from '@/components/InputSelect'
import Modal from '@/components/Modal'
import AddCard from '@/components/NuevaVenta/AddCard'
import AddProduct from '@/components/NuevaVenta/AddProduct'
import ItemCartProduct from '@/components/NuevaVenta/ItemCartProduct'
import NewOrder from '@/components/NuevaVenta/NewOrder'
import TextArea from '@/components/TextArea'
import ToggleSwitch from '@/components/ToggleSwitch'
import { useInputValue } from '@/hooks/useInputValue'
import { useSearch } from '@/hooks/useSearch'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { getUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const preData = [{_id: 1, descripcion: 'EFECTIVO'}, {_id: 2, descripcion: 'TARJETA'}]

export default function NuevaVenta() {

    const searchProduct = useInputValue('','')
    const searchClient = useInputValue('','')
    const [consumidorFinal, setConsumidorFinal] = useState(false)
    const [cart, setCart] = useState([])
    const [productos, setProductos] = useState([])
    const [productSelected, setProductSelected] = useState(undefined)
    const [clientes, setClientes] = useState([])
    const [clientSelected, setClientSelected] = useState(undefined)
    const user = useAppSelector(getUser);
    const [openAddProduct, setOpenAddProduct] = useState(false)
    const dispatch = useAppDispatch();
    const [openNewClient, setOpenNewClient] = useState(false)
    const [pago, setPago] = useState(undefined)
    const [observacion, setObservacion] = useState('')
    const [totalEfectivo, setTotalEfectivo] = useState(0)
    const [totalTarjeta, setTotalTarjeta] = useState(0)
    const [openAddCard, setOpenAddCard] = useState(false)
    const [openNewOrder, setOpenNewOrder] = useState(false)
    const [dateCard, setDateCard] = useState(undefined)
    const [dataOrder, setDataOrder] = useState(undefined)

    const tag = ["descripcion", "codigo"]

    const listProducto = useSearch(searchProduct.value, tag, productos)

    const tag2 = ["nombreCompleto", "dni"]

    const listCliente = useSearch(searchClient.value, tag2, clientes)

    const addCart = (item) => {
      if(item) {
        const exist = cart.some(elem => elem._id === item._id )
        !exist && setCart((prevData)=>{
          searchProduct.clearValue()
          dispatch(setAlert({
            message: 'Producto agregado correctamente',
            type: 'success'
          }))
          setOpenAddProduct(false)
          return [...prevData, item]
        })
        return setOpenAddProduct(false)
      } 
    }

    const reset = () => {
      setCart([])
      setProductSelected(undefined)
      setClientSelected(undefined)
      setPago(undefined)
      setObservacion('')
      setTotalEfectivo(0)
      setTotalTarjeta(0)
      setDateCard(undefined)
      setDataOrder(undefined)
    }

    const finishSale = async () => {
      let venta = {
        fecha: new Date,
        total: pago.descripcion === 'TARJETA' ? totalTarjeta : totalEfectivo,
        observacion: observacion,
        tipoPago: {
          descripcion: pago.descripcion,
          banco: dateCard && dateCard.banco,
          cuotas: dateCard && dateCard.cuotas,
        },
        idEmpleado: user.idEmpleado,
        idSucursal: user.idSucursal,
        idCliente: clientSelected._id,
        idOrden: ''
      }
      if (dataOrder) {
        apiClient.post('/orden', dataOrder,{
          headers: {
            Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
        .then(r=>{
          venta.idOrden=r.data.body._id
          apiClient.post('/venta', venta,{
            headers: {
              Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
            }
          })
            .then(r=>{
              reset()
              dispatch(setAlert({
                message: 'Venta creada correctamente',
                type: 'success'
              }))
            })
            .catch(e=>console.log(e)) 
        })
        .catch(e=>console.log(e))
      }else{
        apiClient.post('/venta', venta,{
          headers: {
            Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
          .then(r=>{
            reset()
            dispatch(setAlert({
              message: 'Venta creada correctamente',
              type: 'success'
            }))
          })
          .catch(e=>console.log(e)) 
      }
    }

    useEffect(() => {
      apiClient.get(`/producto`,{
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
      .then((r)=>setProductos(r.data.body))
      .catch((e)=>console.log('error',e))
      apiClient.get(`/cliente`,{
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
      .then((r)=>{
        console.log("clientes",r.data.body)
        setClientes(r.data.body)
      })
      .catch((e)=>console.log('error',e))
    }, [])
    
    useEffect(()=>{

      if (cart.length > 1) {

          const initialValue = 0

          const sumEfectivo = cart?.reduce( (accumulator, currentValue) => {
              return (parseFloat(accumulator) + parseFloat(currentValue.totalEfectivo)).toFixed(2)
          }, initialValue)

          const sumTarjeta = cart?.reduce( (accumulator, currentValue) => {
            return (parseFloat(accumulator) + parseFloat(currentValue.totalTarjeta)).toFixed(2)
          }, initialValue)
          
          setTotalTarjeta(sumTarjeta)
          setTotalEfectivo(sumEfectivo)
      }
      if(cart.length === 1){
         setTotalEfectivo(cart[0].totalEfectivo)
         setTotalTarjeta(cart[0].totalTarjeta)
      }
      if(cart.length === 0) {
        setTotalEfectivo(0)
        setTotalTarjeta(0)
      }
      
    },[cart])

  return (
    <Container>
        <ContainerCart>
            <div style={{margin: '7px 0'}}>
              <InputSearch placeholder={'Buscar Productos'} {...searchProduct} width='95%' data={listProducto} modal={true} prop={'descripcion'} onSelect={(item)=>{
                setProductSelected(item)
                setOpenAddProduct(true)
              }} />
            </div>
            <List>
                {
                  cart.length === 0 ?
                  <EmptyList />
                  :
                  cart.map((item, index) => (
                    <ItemCartProduct
                        key={index}
                        item={item}
                        changeCart={(item)=>{
                          console.log(item)
                          setCart((prevData)=>prevData.map(elem=>elem._id===item._id ? item : elem))
                        }}
                    />
                  ))
                }
            </List>
        </ContainerCart>
        <ContainerClient >
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <InputSearch placeholder={'Buscar Cliente'} {...searchClient} width='95%' data={listCliente} modal={true} prop={'nombreCompleto'} onSelect={(item)=>{
                      setClientSelected(item)
                    }}  
                  />
                  <Button text={'NUEVO'} onClick={() => setOpenNewClient(true)} />
                </div>
                <div style={{marginTop: 15, backgroundColor: '#fff', borderRadius: 15, padding: 15 }}>
                    <ToggleSwitch checked={consumidorFinal} onChange={(value)=>setConsumidorFinal(value)} label={'Consumidor final'}/>
                    <Title color={process.env.TEXT_COLOR}>Nombre Completo : {clientSelected?.nombreCompleto || ''}</Title>
                    <Tag color={process.env.TEXT_COLOR}> Telefono : {clientSelected?.telefono || ''}</Tag>
                    <Tag color={process.env.TEXT_COLOR}> DNI : {clientSelected?.dni || ''}</Tag>
                    <Tag color={process.env.TEXT_COLOR}> Seña activa : {clientSelected?.senia || ''}</Tag>
                </div>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: 15, padding: '0 15px', flex: 1, margin: '15px 0'}}>
                <InputSelect label={'Tipo de pago'} name={'tipoPago'} value={''} preData={preData} onChange={(item)=>{
                  if (item.descripcion === 'TARJETA') {
                    setOpenAddCard(true)
                  }
                  setPago(item)
                }} />
                {
                  dateCard && 
                  <>
                    <Tag color={process.env.TEXT_COLOR}> Banco : {dateCard?.banco || ''}</Tag>
                    <Tag color={process.env.TEXT_COLOR}> Cuotas : {dateCard?.cuotas || ''}</Tag>
                  </>
                }
                <InputSelect label={'Obra social'} name={'obrasocial'} value={''} onChange={(id)=>{
                  if (id!==undefined) {
                    setOpenNewOrder(true)
                  }
                  setDataOrder(prevData=>{
                    return {
                      ...prevData,
                      idObraSocial: id
                    }
                  })
                }} />
                <TextArea label={"Observacion"} name='observacion' value={observacion} onChange={(e)=>setObservacion(e.target.value)} />
                <Tag color={process.env.TEXT_COLOR} style={{textAlign: 'end'}}> Total Tarjeta : $ {totalTarjeta} </Tag>
                <Tag color={process.env.TEXT_COLOR} style={{textAlign: 'end'}}> Total Efectivo : $ {totalEfectivo} </Tag>
                <div style={{display: 'flex', flex: 1, justifyContent: 'end', alignItems: 'end'}} >
                  <Button text={'CONTINUAR'} onClick={finishSale} />
                </div>
            </div>
        </ContainerClient>
        {
          openAddProduct &&
          <Modal 
            open={openAddProduct} 
            eClose={()=>setOpenAddProduct(false)} 
            title={'AGREGAR PRODUCTO'} 
            height='auto'
            width='25%'
          >
            <AddProduct item={productSelected} addCart={addCart} onClose={()=>setOpenAddProduct(false)} user={user} />
          </Modal>
        }
        {
          openNewClient && 
          <Modal 
            open={openNewClient} 
            eClose={()=>setOpenNewClient(false)} 
            title={'NUEVO CLIENTE'} 
            height='auto'
            width='35%'
          >
            <NewEditCliente handleClose={()=>setOpenNewClient(false)} token={user.token} />
          </Modal>
        }
        {
          openAddCard && 
          <Modal 
            open={openAddCard} 
            eClose={()=>setOpenAddCard(false)} 
            title={'NUEVA TARJETA'} 
            height='auto'
            width='35%'
          >
            <AddCard total={totalTarjeta} setDateCard={(card) => setDateCard(card)} onClose={()=>setOpenAddCard(false)} />
          </Modal>
        }
        {
          openNewOrder && 
          <Modal 
            open={openNewOrder} 
            eClose={()=>setOpenNewOrder(false)} 
            title={'NUEVA ORDEN'} 
            height='auto'
            width='35%'
          >
            <NewOrder onClose={()=>setOpenNewOrder(false)} setDateCard={(order) => setDataOrder(prevData=>{
              return {
                ...prevData,
                ...order
              }
            })} />
          </Modal>
        }
    </Container>
  )
}

const Container = styled.div `
  display:flex;
  flex: 1;
  @media only screen and (max-width: 445px) {
    flex-direction: column;
  }
`

const ContainerCart = styled.div `
  display: flex; 
  flex-direction: column;
  flex: 1; 
  padding: 5px; 
  width: 65%;
  @media only screen and (max-width: 445px) {
    width: auto;
    display: block;
    flex: 0;
  }
`

const ContainerClient = styled.div `
  display: flex; 
  flex-direction: column;
  flex: 1; 
  padding: 5px; 
  width: 35%;
  @media only screen and (max-width: 445px) {
    width: auto;
  }
`

const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  overflow-y: scroll;
  @media only screen and (max-width: 445px) {
    height: 350px
  }
`

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

const Tag = styled.h2 `
    font-size: 16px;
    font-weight: 500;
    color: ${props=>props.color};
    @media only screen and (max-width: 1024px) {
        font-size: 14px;
    }
`
