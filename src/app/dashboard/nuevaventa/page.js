'use client'
import Button from '@/components/Button'
import NewEditCliente from '@/components/Clientes/NewEditCliente'
import EmptyList from '@/components/EmptyList'
import Input from '@/components/Input'
import InputSearch from '@/components/InputSearch'
import InputSelect from '@/components/InputSelect'
import Modal from '@/components/Modal'
import NotPermissions from '@/components/NotPermissions'
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
const io = require('socket.io-client')

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
    const [pago, setPago] = useState({_id: 1, descripcion: 'EFECTIVO'})
    const [observacion, setObservacion] = useState('')
    const [total, setTotal] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const [descuento, setDescuento] = useState(0)
    const [openAddCard, setOpenAddCard] = useState(false)
    const [openNewOrder, setOpenNewOrder] = useState(false)
    const [dataCard, setDataCard] = useState(undefined)
    const [dataOrder, setDataOrder] = useState({idObraSocial: '', fecha: '', numero: ''})
    const [obraSocialSelected, setObraSocialSelected] = useState(undefined)
    const [dineroIngresado, setDineroIngresado] = useState(0)
    const [tagSearch, setTagSearch] = useState([])
    const [permission, setPermission] = useState(false)

    const tag = ["descripcion", "codigo", "categoria", "color", "alto", "ancho", "marca", "numeracion"]

    const listProducto = useSearch(searchProduct.value, tag, productos, tagSearch)

    const tag2 = ["nombreCompleto", "dni"]

    const listCliente = useSearch(searchClient.value, tag2, clientes)

    const addCart = (item) => {
      if(item) {
        const exist = cart.some(elem => elem._id === item._id )
        if (!exist) {
          setCart((prevData)=>{
            searchProduct.clearValue()
            dispatch(setAlert({
              message: 'Producto agregado correctamente',
              type: 'success'
            }))
            setOpenAddProduct(false)
            return [...prevData, item]
          })
        }
        return setOpenAddProduct(false)
      } 
    }

    useEffect(()=>{
      if (user.usuario !== '') {  
        user.roles.permisos.forEach((permiso) => {
            if (permiso.screen.toLowerCase() === 'venta') {
              if (!permiso.lectura) {
                return setPermission(false)
              }
              return setPermission(true)
            }
        });
      }
    },[user])

    const reset = () => {
      setCart([])
      setProductSelected(undefined)
      setClientSelected(undefined)
      setPago({_id: 1, descripcion: 'EFECTIVO'})
      setObservacion('')
      setSubTotal(0)
      setTotal(0)
      setDataCard(undefined)
      setDataOrder({idObraSocial: '', fecha: '', numero: ''})
      setDineroIngresado(0)
      setDescuento(0)
    }

    const finishSale = async () => {
      user.roles.permisos.forEach((permiso) => {
        if (permiso.screen.toLowerCase() === 'venta') {
          if (!permiso.escritura) {
            dispatch(setAlert({
              message: 'NO TIENES PERMISOS DE USUARIO',
              type: 'error'
            }))
            return;
          }
        }
      });
      if (cart.length === 0) {
        dispatch(setAlert({
          message: 'No se ingreso ningun producto',
          type: 'warning'
        }))
        return;
      }
      if (!clientSelected) {
        dispatch(setAlert({
          message: 'No se eligio ningun cliente',
          type: 'warning'
        }))
        return;
      }
      if (pago.descripcion === 'TARJETA' && dataCard === undefined) {
        dispatch(setAlert({
          message: 'No se ingreso datos de pago',
          type: 'error'
        }))
        return;
      }
      if (obraSocialSelected && !dataOrder) {
        dispatch(setAlert({
          message: 'No se ingreso datos de la orden',
          type: 'error'
        }))
        return;
      }
      console.log(parseFloat(dineroIngresado) > parseFloat(total), parseFloat(dineroIngresado), parseFloat(total));
      if (parseFloat(dineroIngresado) > parseFloat(total)) {
        dispatch(setAlert({
          message: 'No se puede ingresar un valor mayor al total',
          type: 'error'
        }))
        return;
      }
      if ( clientSelected._id === '64c95db35ae46355b5f7df64' && dineroIngresado < total) {
        dispatch(setAlert({
          message: 'Consumidor final tiene que ingresar el total de la venta',
          type: 'error'
        }))
        return;
      }
      try {
        let venta = {
          fecha: new Date,
          total: total,
          observacion: observacion,
          tipoPago: {
            descripcion: pago.descripcion,
            banco: dataCard && dataCard.banco,
            cuotas: dataCard && dataCard.cuotas,
          },
          idEmpleado: user.idEmpleado,
          idSucursal: user.idSucursal,
          idCliente: clientSelected._id,
          idOrden: '',
          descuento: descuento,
          subTotal: subTotal,
          dineroIngresado :  pago.descripcion === 'TARJETA' ?  total : (dineroIngresado <= 0 ? total : dineroIngresado )
        }
        console.log(venta)
        if (dataOrder.idObraSocial !== '') {
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
                cart.map(itemCart => {
                  apiClient.post('lineaventa', {
                    idProducto: itemCart._id,
                    cantidad: itemCart.cantidad,
                    total: pago.descripcion === 'TARJETA' ? itemCart.totalTarjeta : itemCart.totalEfectivo,
                    idVenta: r.data.body._id
                  },{
                    headers: {
                      Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
                    }
                  })
                  .then(r=>{
                      apiClient.patch(`/stock/${itemCart.idStock}`, {
                        idSucursal: user.idSucursal, 
                        cantidad: parseFloat(itemCart.stock)-parseFloat(itemCart.cantidad)
                      },
                      {
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
                      .catch(e=>dispatch(setAlert({
                        message: 'Hubo un error inesperado al descontar stock',
                        type: 'error'
                      })))
                    
                  })
                  .catch(e=>dispatch(setAlert({
                    message: `${e}`,
                    type: 'error'
                  }))) 
                })
              })
              .catch(e=>dispatch(setAlert({
                message: `${e}`,
                type: 'error'
              }))) 
          })
          .catch(e=>dispatch(setAlert({
            message: `${e}`,
            type: 'error'
          })))
        }else{
          apiClient.post('/venta', venta,{
            headers: {
              Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
            }
          })
            .then(r=>{
              cart.map(itemCart => {
                apiClient.post('lineaventa', {
                  idProducto: itemCart._id,
                  cantidad: itemCart.cantidad,
                  total: pago.descripcion === 'TARJETA' ? itemCart.totalTarjeta : itemCart.totalEfectivo,
                  idVenta: r.data.body._id
                },{
                  headers: {
                    Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
                  }
                })
                .then(r=>{
                  apiClient.patch(`/stock/${itemCart.idStock}`, {
                    idSucursal: user.idSucursal, 
                    cantidad: parseFloat(itemCart.stock)-parseFloat(itemCart.cantidad)
                  },
                  {
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
                  .catch(e=>dispatch(setAlert({
                    message: 'Hubo un error inesperado al descontar stock',
                    type: 'error'
                  })))
                })
                .catch(e=>dispatch(setAlert({
                  message: `${e}`,
                  type: 'error'
                }))) 
              })
            })
            .catch(e=>dispatch(setAlert({
              message: `${e}`,
              type: 'error'
            }))) 
        } 
      } catch (error) {
        console.log(error, "error")
        dispatch(setAlert({
          message: 'Ocurrio un error, revise los datos',
          type: 'error'
        }))
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
        setClientes(r.data.body)
      })
      .catch((e)=>console.log('error',e))
    }, [])

    useEffect(()=>{
      console.log('cambio');
      if (cart.length === 0) {
        setSubTotal(0)
        setTotal(0)
        return;
      }

      const initialValue = 0

      const sumEfectivo = cart?.reduce( (accumulator, currentValue) => {
          return (parseFloat(accumulator) + parseFloat(currentValue.totalEfectivo)).toFixed(2)
      }, initialValue)
      const sumTarjeta = cart?.reduce( (accumulator, currentValue) => {
        console.log(currentValue)
        return (parseFloat(accumulator) + parseFloat(currentValue.totalTarjeta)).toFixed(2)
      }, initialValue)

      if (!obraSocialSelected) {
        if (pago.descripcion === 'TARJETA') {
          setSubTotal(sumTarjeta)
          setTotal(sumTarjeta)
          console.log('sin obra social y pago con tarjeta', sumTarjeta)
          return;
        }else{
          setSubTotal(sumEfectivo)
          setTotal(sumEfectivo)
          console.log('sin obra social y pago con efectivo', sumEfectivo)
          return;
        }
      }
      if (obraSocialSelected.productosDescuento.length === 0) {
        if (obraSocialSelected.tipoDescuento) {
          if (pago.descripcion === 'TARJETA') {
            let descuentoTotal = 0
            descuentoTotal = (parseFloat(obraSocialSelected.cantidadDescuento)).toFixed(2)
            setDescuento(descuentoTotal)
            setSubTotal(sumTarjeta)
            setTotal(sumTarjeta-descuentoTotal)
            console.log('con obra social , pago con tarjeta y descuento efectivo a cualquier producto')
            return;
          }else{
            let descuentoTotal = 0
            descuentoTotal = (parseFloat(obraSocialSelected.cantidadDescuento)).toFixed(2)
            setDescuento(descuentoTotal)
            setSubTotal(sumEfectivo)
            setTotal(sumEfectivo-descuentoTotal)
            console.log('con obra social, pago con efectivo y descuento efectivo a cualquier producto')
            return;
          }
        }else{
          if (pago.descripcion === 'TARJETA') {
            let descuentoTotal = 0
            descuentoTotal = (parseFloat(sumTarjeta*(obraSocialSelected.cantidadDescuento)/100)).toFixed(2)
            setDescuento(descuentoTotal)
            setSubTotal(sumTarjeta)
            setTotal(sumTarjeta-descuentoTotal)
            console.log('con obra social , pago con tarjeta y descuento porcentaje a cualquier producto')
            return;
          }else{
            let descuentoTotal = 0
            descuentoTotal = (parseFloat(sumEfectivo*(obraSocialSelected.cantidadDescuento)/100)).toFixed(2)
            setDescuento(descuentoTotal)
            setSubTotal(sumEfectivo)
            setTotal(sumEfectivo-descuentoTotal)
            console.log('con obra social, pago con efectivo y descuento porcentaje a cualquier producto')
            return;
          }
        }
      }else{
        let descuentoTotal = 0
        cart.forEach(itemCart=>{
          if (obraSocialSelected.productosDescuento.includes(itemCart._id)) {
            if (obraSocialSelected.tipoDescuento) {
              if (pago.descripcion === 'TARJETA') {
                descuentoTotal = (parseFloat(descuentoTotal)+(parseFloat(obraSocialSelected.cantidadDescuento))).toFixed(2)
                console.log('con obra social , pago con tarjeta y descuento efectivo a un producto')
                return ;
              }else{
                descuentoTotal = (parseFloat(descuentoTotal)+(parseFloat(obraSocialSelected.cantidadDescuento))).toFixed(2)
                console.log('con obra social, pago con efectivo y descuento efectivo a un producto')
              }
            }else{
              if (pago.descripcion === 'TARJETA') {
                descuentoTotal = (parseFloat(descuentoTotal)+(parseFloat(parseFloat(itemCart.totalTarjeta)*(obraSocialSelected.cantidadDescuento)/100))).toFixed(2)
                console.log('con obra social , pago con tarjeta y descuento porcentaje a un producto')
              }else{
                descuentoTotal = (parseFloat(descuentoTotal)+(parseFloat(parseFloat(itemCart.totalEfectivo)*(obraSocialSelected.cantidadDescuento)/100))).toFixed(2)
                console.log('con obra social, pago con efectivo y descuento porcentaje a un producto')
              }
            }
          }
        })
        if (pago.descripcion === 'TARJETA') {
          setDescuento(descuentoTotal)
          setSubTotal(sumTarjeta)
          setTotal(sumTarjeta-descuentoTotal)
        }else{
          setDescuento(descuentoTotal)
          setSubTotal(sumEfectivo)
          setTotal(sumEfectivo-descuentoTotal)
        }
      }
      
    },[cart, pago, obraSocialSelected])
    
    useEffect(()=>{
      if (consumidorFinal) {
        setClientSelected({
          _id: '64c95db35ae46355b5f7df64',
          nombreCompleto: 'CONSUMIDOR FINAL'
        })
      }
    },[consumidorFinal])

    useEffect(()=>{
      console.log('cambio', openNewOrder, dataOrder);
      if (!openNewOrder && dataOrder.fecha === '' && dataOrder.idObraSocial !== '') {
        dispatch(setAlert({
          message: 'Necesita completar los datos',
          type: 'warning'
        }))
        setOpenNewOrder(true)
        return;
      }
    },[openNewOrder])

    useEffect(()=>{
      const socket = io('http://localhost:3001/')
      socket.on('cliente', (cliente) => {
        setClientes((prevData)=>{
          const exist = prevData.find(elem => elem._id === cliente.res._id )
          if (exist) {
            return prevData.map((item) =>
            item._id === cliente.res._id ? cliente.res : item
          )
          }
          return [...prevData, cliente.res]
        })
      })
      return () => {
        socket.disconnect();
      }; 
    },[clientes])

    /* useEffect(() => {
      console.log('cambio');
    
      if (cart.length === 0) {
        return;
      }
    
      const initialValue = 0;
    
      const sumEfectivo = cart.reduce((accumulator, currentValue) => {
        return (parseFloat(accumulator) + parseFloat(currentValue.totalEfectivo)).toFixed(2);
      }, initialValue);
    
      const sumTarjeta = cart.reduce((accumulator, currentValue) => {
        return (parseFloat(accumulator) + parseFloat(currentValue.totalTarjeta)).toFixed(2);
      }, initialValue);
    
      let descuentoTotal = 0;
    
      if (obraSocialSelected) {
        if (obraSocialSelected.productosDescuento.length === 0) {
          if (obraSocialSelected.tipoDescuento) {
            descuentoTotal = parseFloat(obraSocialSelected.cantidadDescuento).toFixed(2);
          } else {
            descuentoTotal = parseFloat(
              pago.descripcion === 'TARJETA'
                ? obraSocialSelected.cantidadDescuento
                : sumEfectivo * (obraSocialSelected.cantidadDescuento / 100)
            ).toFixed(2);
          }
        } else {
          cart.forEach((itemCart) => {
            if (obraSocialSelected.productosDescuento.includes(itemCart._id)) {
              descuentoTotal = parseFloat(
                obraSocialSelected.tipoDescuento
                  ? obraSocialSelected.cantidadDescuento
                  : pago.descripcion === 'TARJETA'
                  ? parseFloat(itemCart.totalTarjeta) * (obraSocialSelected.cantidadDescuento / 100)
                  : parseFloat(itemCart.totalEfectivo) * (obraSocialSelected.cantidadDescuento / 100)
              ).toFixed(2);
            }
          });
        }
      }
    
      const subTotal = pago.descripcion === 'TARJETA' ? sumTarjeta : sumEfectivo;
      const total = (subTotal - descuentoTotal).toFixed(2);
    
      setDescuento(descuentoTotal);
      setSubTotal(subTotal);
      setTotal(total);
    
      console.log('Calculations done:', { descuentoTotal, subTotal, total });
    
    }, [cart, pago, obraSocialSelected]); */

    if (!permission) {
      return <NotPermissions/>
    }

  return (
    <Container>
        <ContainerCart>
            <div style={{margin: '7px 0'}}>
              <InputSearch placeholder={'Buscar Productos'} {...searchProduct} width='100%' data={listProducto} modal={true} prop={'descripcion'} onSelect={(item)=>{
                setProductSelected(item)
                setOpenAddProduct(true)
              }} 
              tags={tag}
              tagSearch={tagSearch}
              deleteTagSearch={(item) => setTagSearch((prevData) => prevData.filter((elem) => elem.tag !== item.tag))}
              onSelectTag={(search, tag) =>
                tag !== 'SIN ETIQUETA' &&
                setTagSearch((prevData) =>
                  !prevData.find((elem) => elem.tag === tag) ? [...prevData, { search, tag }] : prevData
                )
              }
              />
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
                        tipoPago={pago.descripcion === 'EFECTIVO' ? true : false}
                        deleteItem={(id)=>setCart((prevData)=>prevData.filter(elem=>elem._id!==id))}
                        changeCart={(item)=>{
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
                    <Tag color={process.env.TEXT_COLOR}> Telefono : {clientSelected?.telefono || '-'}</Tag>
                    <Tag color={process.env.TEXT_COLOR}> DNI : {clientSelected?.dni || '-'}</Tag>
                    <Tag color={process.env.TEXT_COLOR}> Seña activa : {clientSelected?.senia?.saldo || '-'}</Tag>
                </div>
            </div>
            <ContainerInfo>
                <InputSelect label={'Tipo de pago'} name={'tipoPago'} value={pago.descripcion} preData={preData} onChange={(_id, item)=>{
                  if (item.descripcion === 'TARJETA') {
                    setOpenAddCard(true)
                  }else{
                    setDataCard(undefined)
                  }
                  setPago(item)
                }} />
                {
                  dataCard && 
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Tag color={process.env.TEXT_COLOR} style={{margin: 0}}> Banco : {dataCard?.banco || ''}</Tag>
                    <Tag color={process.env.TEXT_COLOR} style={{margin: 0}} > Cuotas : {dataCard?.cuotas+`x${(total/dataCard?.cuotas).toFixed(2)}` || ''}</Tag>
                  </div>
                }
                <InputSelect label={'Obra social'} name={'obrasocial'} value={''} emptyOption={[{_id: '', descripcion: 'Sin obra social'}]} onChange={(id, item)=>{
                  if (id!==undefined && id !== '') {
                    setOpenNewOrder(true)
                    setObraSocialSelected(item)
                  }
                  if (id == '') {
                    setDataOrder({idObraSocial: '', fecha: '', numero: ''})
                    return;
                  }
                  setDataOrder(prevData=>{
                    console.log("aca",prevData)
                    return {
                      ...prevData,
                      idObraSocial: id
                    }
                  })
                }} />
                <TextArea label={"Observacion"} name='observacion' value={observacion} onChange={(e)=>setObservacion(e.target.value)} />
                <div style={{textAlign: 'end'}} >
                  <Tag color={process.env.TEXT_COLOR} > Descuento : $ {descuento} </Tag>   
                  <Tag color={process.env.TEXT_COLOR}> Sub-Total : $ {subTotal} </Tag>
                  <Tag color={process.env.TEXT_COLOR} > Total : $ {total} </Tag>
                  <Input label={"Dinero ingresado"} type='text' name='dineroIngresado' value={dineroIngresado} onChange={(e)=>setDineroIngresado(e.target.value)}/>
                </div>
                <div style={{display: 'flex', flex: 1, justifyContent: 'end', alignItems: 'end'}} >
                  <Button text={'CONTINUAR'} onClick={finishSale} />
                </div>
            </ContainerInfo>
        </ContainerClient>
        {
          openAddProduct &&
          <Modal 
            open={openAddProduct} 
            eClose={()=>setOpenAddProduct(false)} 
            title={'AGREGAR PRODUCTO'} 
            height='auto'
            width='30%'
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
            <AddCard total={total} setDataCard={(card) => setDataCard(card)} onClose={()=>setOpenAddCard(false)} />
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
            <NewOrder onClose={()=>setOpenNewOrder(false)} setDataCard={(order) => setDataOrder(prevData=>{
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
  @media only screen and (max-width: 650px) {
    flex-direction: column;
  }
`

const ContainerCart = styled.div `
  display: flex; 
  flex-direction: column;
  flex: 1; 
  padding: 5px; 
  width: 65%;
  @media only screen and (max-width: 650px) {
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
  @media only screen and (max-width: 650px) {
    width: auto;
  }
`

const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  overflow-y: scroll;
  @media only screen and (max-width: 650px) {
    height: 350px
  }
`

const Title = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 5px 0;
    color: ${props=>props.color};
    @media only screen and (max-width: 1440px) {
        font-size: 16px;
    }
    @media only screen and (max-width: 650px) {
        font-size: 14px;
    }
`

const Tag = styled.h2 `
    font-size: 16px;
    font-weight: 500;
    color: ${props=>props.color};
    @media only screen and (max-width: 1440px) {
        font-size: 14px;
    }
`
const ContainerInfo = styled.div `
  background-color: #fff;
  border-radius: 15px;
  padding: 0 15px; 
  flex: 1; 
  margin: 15px 0;
  overflow-y: scroll;
  flex: 1
`