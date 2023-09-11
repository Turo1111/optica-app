'use client'
import Button from '@/components/Button'
import NewEditCliente from '@/components/Clientes/NewEditCliente'
import Confirm from '@/components/Confirm'
import EmptyList from '@/components/EmptyList'
import Input from '@/components/Input'
import InputSearch from '@/components/InputSearch'
import InputSelect from '@/components/InputSelect'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import NotPermissions from '@/components/NotPermissions'
import AddCard from '@/components/NuevaVenta/AddCard'
import AddProduct from '@/components/NuevaVenta/AddProduct'
import SelectClient from '@/components/NuevaVenta/ContainerClient'
import DataSale from '@/components/NuevaVenta/DataSale'
import FinishSale from '@/components/NuevaVenta/FinishSale'
import ItemCartProduct from '@/components/NuevaVenta/ItemCartProduct'
import NewOrder from '@/components/NuevaVenta/NewOrder'
import SelectProduct from '@/components/NuevaVenta/SelectProduct'
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
    const [useSenia, setUseSenia] = useState(false)
    const [cuotas, setCuotas] = useState(calculateCuotas(total, dineroIngresado))
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [venta, setVenta] = useState(undefined)
    const [openFinishSale, setOpenFinishSale] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)

    const tag = ["descripcion", "codigo", "categoria", "color", "alto", "ancho", "marca", "numeracion"]

    const listProducto = useSearch(searchProduct.value, tag, productos, tagSearch)

    const tag2 = ["nombreCompleto", "dni"]

    const listCliente = useSearch(searchClient.value, tag2, clientes)

    const addCart = (item) => {
      if (obraSocialSelected || pago.descripcion !== 'EFECTIVO') {
        dispatch(setAlert({
          message: 'Para agregar productos quite la obra social y cambie el tipo de pago a EFECTIVO',
          type: 'warning'
        }))
        return
      }
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

    useEffect(()=>{
      if (dineroIngresado <= 0) {
        setCuotas(calculateCuotas(parseFloat(total), dineroIngresado))
        return
      }
      setCuotas(calculateCuotas(total, dineroIngresado))
      return;
    },[total,dineroIngresado])

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
      setObraSocialSelected(undefined)
      setLoading(false)
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
      if (parseFloat(dineroIngresado) > (parseFloat(total)+parseFloat(dineroIngresado))) {
        dispatch(setAlert({
          message: 'No se puede ingresar un valor mayor al total',
          type: 'error'
        }))
        return;
      }
      if ( clientSelected._id === '64c95db35ae46355b5f7df64' && parseFloat(dineroIngresado).toFixed(2) < parseFloat(total).toFixed(2) && pago.descripcion === 'EFECTIVO' ) {
        
        dispatch(setAlert({
          message: 'Consumidor final tiene que ingresar el total de la venta',
          type: 'error'
        }))
        return;
      }
      if ( user.idSucursal === '' || user.idSucursal === undefined) {
        dispatch(setAlert({
          message: 'Usuario sin sucursal asociada',
          type: 'error'
        }))
        return;
      }
      if ( useSenia && dineroIngresado <= 0) {
        dispatch(setAlert({
          message: 'Ingrese una senia mayor a 0',
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
          cliente: clientSelected.nombreCompleto,
          carrito: cart,
          idOrden: '',
          descuento: descuento,
          subTotal: subTotal,
          useSenia: useSenia,
          orden: dataOrder.numero,
          obraSocial: obraSocialSelected?.descripcion,
          dineroIngresado :  pago.descripcion === 'TARJETA' ?  total : (dineroIngresado <= 0 ? total : dineroIngresado ),
          estado: useSenia ? 'EN TALLER' 
                          : ( pago.descripcion === 'TARJETA' || pago.descripcion === 'EFECTIVO Y TARJETA' ) ? 'ENTREGADO Y PAGADO' 
                            : ( pago.descripcion === 'CUENTA CORRIENTE' || pago.descripcion === 'EFECTIVO' ) && parseFloat(dineroIngresado) < (parseFloat(total)+parseFloat(dineroIngresado)) ? 'ENTREGADO'
                              : 'ENTREGADO Y PAGADO'
        }
        setLoading(true)
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
                    total: itemCart.total,
                    idVenta: r.data.body._id
                  },{
                    headers: {
                      Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
                    }
                  })
                  .then(r=>{
                    if (itemCart._id !== '64f0ca05ae80e2477accbc24' || itemCart._id !== '64f0c9e9ae80e2477accbc14') {
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
                        setOpenFinishSale(true)
                        setVenta(venta)
                        dispatch(setAlert({
                          message: 'Venta creada correctamente',
                          type: 'success'
                        }))
                      })
                      .catch(e=>{
                        setLoading(false)
                        dispatch(setAlert({
                        message: `${e.response.data.error || 'Ocurrio un error'}`,
                        type: 'error'
                      }))})
                    }
                    
                  })
                  .catch(e=>{
                    setLoading(false)
                    dispatch(setAlert({
                    message: `${e.response.data.error || 'Ocurrio un error'}`,
                    type: 'error'
                  }))}) 
                })
              })
              .catch(e=>{
                setLoading(false)
                dispatch(setAlert({
                message: `${e.response.data.error || 'Ocurrio un error'}`,
                type: 'error'
              }))}) 
          })
          .catch(e=>{
            setLoading(false)
            dispatch(setAlert({
            message: `${e.response.data.error || 'Ocurrio un error'}`,
            type: 'error'
          }))})
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
                  total: itemCart.total,
                  idVenta: r.data.body._id
                },{
                  headers: {
                    Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
                  }
                })
                .then(r=>{
                  if (itemCart._id !== '64f0ca05ae80e2477accbc24' || itemCart._id !== '64f0c9e9ae80e2477accbc14') {
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
                      setOpenFinishSale(true)
                      setVenta(venta)
                      dispatch(setAlert({
                        message: 'Venta creada correctamente',
                        type: 'success'
                      }))
                    })
                    .catch(e=>{
                      setLoading(false)
                      dispatch(setAlert({
                      message: `${e.response.data.error || 'Ocurrio un error'}`,
                      type: 'error'
                    }))})
                  }
                })
                .catch(e=>{
                  setLoading(false)
                  dispatch(setAlert({
                  message: `${e.response.data.error || 'Ocurrio un error'}`,
                  type: 'error'
                }))}) 
              })
            })
            .catch(e=>{
              setLoading(false)
              dispatch(setAlert({
              message: `${e.response.data.error || 'Ocurrio un error'}`,
              type: 'error'
            }))}) 
        } 
      } catch (error) {
        setLoading(false)
        dispatch(setAlert({
          message: 'Ocurrio un error, revise los datos',
          type: 'error'
        }))
      }
      
    }

    const getClienteProducto = () => {
      
    }

    useEffect(() => {
      setLoadingData(true)
      apiClient.get(`/producto`,{
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
      .then((r)=>{
        setProductos(r.data.body)
      })
      .catch((e)=>dispatch(setAlert({
        message: 'Error en el servidor, revise el estado',
        type: 'error'
      })))
      apiClient.get(`/cliente`,{
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
      .then((r)=>{
        setLoadingData(false)
        setClientes(r.data.body)
      })
      .catch((e)=>dispatch(setAlert({
        message: 'Error en el servidor, revise el estado',
        type: 'error'
      })))
    }, [user.token, dispatch])
    
    useEffect(()=>{
      if (consumidorFinal) {
        setClientSelected({
          _id: '64c95db35ae46355b5f7df64',
          nombreCompleto: 'CONSUMIDOR FINAL'
        })
      }
    },[consumidorFinal])

    useEffect(()=>{
      if (!openNewOrder && dataOrder.fecha === '' && dataOrder.idObraSocial !== '') {
        dispatch(setAlert({
          message: 'Necesita completar los datos',
          type: 'warning'
        }))
        setOpenNewOrder(true)
        return;
      }
    },[openNewOrder, dataOrder, dispatch])

    useEffect(()=>{
      const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
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

    useEffect(()=>{
      if (!useSenia) {
        setDineroIngresado(0)
      }
    },[useSenia])

    useEffect(()=>{
      const initialValue = 0
      const sumTotal = cart?.reduce( (accumulator, currentValue) => {
          return (parseFloat(accumulator) + parseFloat(currentValue.total)).toFixed(2)
      }, initialValue)
      if(pago.descripcion === 'EFECTIVO' || pago.descripcion === 'CUENTA CORRIENTE' ){
        setSubTotal(parseFloat(sumTotal))
        setTotal((parseFloat(sumTotal)-descuento))
        return;
      }
      if(pago.descripcion === 'TARJETA'){
        setSubTotal(parseFloat(sumTotal))
        setTotal( ((parseFloat(sumTotal)+(parseFloat(sumTotal)*(20/100)))-descuento))
        return;
      }
      if(pago.descripcion === 'EFECTIVO Y TARJETA'){
        setSubTotal((parseFloat(sumTotal)).toFixed(2))
        setTotal( (((parseFloat(dineroIngresado) + ((sumTotal-dineroIngresado)+((sumTotal-dineroIngresado)*(20/100))))-descuento)).toFixed(2))
        return;
      }
    },[dataCard, dineroIngresado, cart, descuento, pago])

    useEffect(()=>{
      if (!obraSocialSelected) {
        setCart(prevData=>prevData.map(itemCart=>{
          return {...itemCart, total : itemCart.descuento !== undefined ? 
            (parseFloat(itemCart.precioEfectivo)*parseFloat(itemCart.cantidad))-(parseFloat(itemCart.precioEfectivo)*parseFloat(itemCart.cantidad)*(itemCart.descuento/100)) :
            parseFloat(itemCart.precioEfectivo)*parseFloat(itemCart.cantidad)
          }
        }))
        setDescuento(0)
        return
      }
      if (obraSocialSelected.productosDescuento.length === 0) {
        let descuento = obraSocialSelected.tipoDescuento ? parseFloat(obraSocialSelected.cantidadDescuento) : total*parseFloat(obraSocialSelected.cantidadDescuento/100)
        setDescuento(parseFloat(descuento).toFixed(2))
        return;
      }
      if (obraSocialSelected.productosDescuento.length !== 0) {
        let descuentoTotal = 0
          cart.forEach(itemCart=>{
            if (obraSocialSelected.productosDescuento.includes(itemCart._id)) {
              let descuento = obraSocialSelected.tipoDescuento ? 
              parseFloat(obraSocialSelected.cantidadDescuento) : 
              parseFloat(itemCart.precioEfectivo*itemCart.cantidad)*parseFloat(obraSocialSelected.cantidadDescuento/100)
              descuentoTotal += descuento
            }
          })
          setDescuento(parseFloat(descuentoTotal).toFixed(2))
      }
      return
    },[obraSocialSelected])

    if (!permission) {
      return <NotPermissions/>
    }

    if (loadingData) {
      return <Loading/>
    }

  return (
    <Container>
      <ContainerSelected>
        <SelectProduct
          searchProduct={searchProduct}
          listProducto={listProducto}
          tag={tag}
          tagSearch={tagSearch}
          deleteTagSearch={(item) => setTagSearch((prevData) => prevData.filter((elem) => elem.tag !== item.tag))}
          onSelectTag={(search, tag) =>
            tag !== 'SIN ETIQUETA' &&
            setTagSearch((prevData) =>
              !prevData.find((elem) => elem.tag === tag) ? [...prevData, { search, tag }] : prevData
          )}
          cart={cart}
          pago={pago}
          deleteItemCart={(id)=>{
            if (obraSocialSelected || pago.descripcion !== 'EFECTIVO') {
              dispatch(setAlert({
                message: 'Para agregar o quitar productos quite la obra social y cambie el tipo de pago a EFECTIVO',
                type: 'warning'
              }))
              return
            }
            setCart((prevData)=>prevData.filter(elem=>elem._id!==id))
          }}
          changeCart={(item)=>{
            if (obraSocialSelected || pago.descripcion !== 'EFECTIVO') {
              dispatch(setAlert({
                message: 'Para agregar o quitar productos quite la obra social y cambie el tipo de pago a EFECTIVO',
                type: 'warning'
              }))
              return
            }
            setCart((prevData)=>prevData.map(elem=>elem._id===item._id ? item : elem))
          }}
          onSelectProduct={(item)=>{
            if (item.idCategoria === '64c94598d2bab952ad754b99') {
              dispatch(setAlert({
                message: 'Para elegir un lente debe seleccionar un armazon primero',
                type: 'warning'
              }))
              return
            }
            setProductSelected(item)
            setOpenAddProduct(true)
          }}
        />
        <SelectClient 
          clientSelected={clientSelected}
          searchClient={searchClient}
          listCliente={listCliente}
          onSelectClient={(item)=>{
            setClientSelected(item)
            setUseSenia(false)
          }}
          openNewClient={() => setOpenNewClient(true)}
          onChangeConsumidorFinal={(value)=>setConsumidorFinal(!consumidorFinal)}
          consumidorFinal={consumidorFinal}
          useSenia={useSenia}
          onChangeUseSenia={(value)=>{
            if (pago.descripcion !== 'EFECTIVO') {
              dispatch(setAlert({
                message: 'No disponible cuando el tipo de pago es distinto a Efectivo',
                type: 'warning'
              }))
              return
            }
            setUseSenia(!useSenia)
          }}
          dineroIngresado={dineroIngresado}
          onChangeDineroIngresado={(e)=>{
            if (parseFloat(e.target.value) <= 0 || e.target.value === '') {
              dispatch(setAlert({
                message: 'Valor incorrecto',
                type: 'warning'
              }))
              return
            }
            if (parseFloat(e.target.value) > parseFloat(total)) {
              dispatch(setAlert({
                message: 'No se puede ingresar un numero mayor al total',
                type: 'warning'
              }))
              return
            }
            setDineroIngresado(e.target.value)
          }}
        />
      </ContainerSelected>
        <DataSale
          pago={pago}
          useSenia={useSenia}
          onChangeTipoPago={(_id, item)=>{
            if (useSenia) {
              dispatch(setAlert({
                message: 'No disponible cuando se realiza una venta señada',
                type: 'warning'
              }))
              return
            }
            if (obraSocialSelected) {
              dispatch(setAlert({
                message: 'Si desea cambiar el metodo de pago, quite la obra social seleccionada',
                type: 'warning'
              }))
              return
            }
            if (item.descripcion === 'TARJETA' || item.descripcion === 'EFECTIVO Y TARJETA' | item.descripcion === 'CUENTA CORRIENTE') {
              setDineroIngresado(0)
              setOpenAddCard(true)
            }else{
              setDataCard(undefined)
            }
            setPago(item)
          }}
          dataCard={dataCard}
          onChangeObraSocial={(id, item)=>{
            if (id!==undefined && id !== '') {
              setOpenNewOrder(true)
              setObraSocialSelected(item)
            }
            if (id == '') {
              setObraSocialSelected(undefined)
              setDataOrder({idObraSocial: '', fecha: '', numero: ''})
              return;
            }
            setDataOrder(prevData=>{
              return {
                ...prevData,
                idObraSocial: id
              }
            })
          }}
          observacion={observacion}
          onChangeObservacion={(e)=>setObservacion(e.target.value)}
          descuento={descuento} subTotal={subTotal} total={total}
          finishSale={()=>setOpenConfirm(true)}
          dineroIngresado={dineroIngresado}
          onChangeDineroIngresado={(e)=>{
            if (parseFloat(e.target.value) > (parseFloat(total))) {
              dispatch(setAlert({
                message: 'No se puede ingresar un numero mayor al total',
                type: 'warning'
              }))
              return
            }
            setDineroIngresado(e.target.value)
          }}
        />
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
            eClose={()=>{
              if (dataCard) {
                setOpenAddCard(false)
              }
            }} 
            title={pago.descripcion === 'CUENTA CORRIENTE' ? 'CUENTA CORRIENTE' : 'NUEVA TARJETA'} 
            height='auto'
            width='35%'
          >
            <AddCard 
              total={total} 
              setDataCard={(card) => setDataCard(card)} 
              onClose={()=>setOpenAddCard(false)} 
              pago={pago}
              dineroIngresado={dineroIngresado}
              onChangeDineroIngresado={(e)=>{
                if (parseFloat(e.target.value) > parseFloat(total)) {
                  dispatch(setAlert({
                    message: 'No se puede ingresar un numero mayor al total',
                    type: 'warning'
                  }))
                  return
                }
                setDineroIngresado(e.target.value)
              }}
              cuota={cuotas}
            />
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
        {
          openFinishSale &&
          <Modal 
            open={openFinishSale} 
            eClose={()=>setOpenFinishSale(false)} 
            title={'Resumen de la venta'} 
            height='auto'
            width='35%'
          >
            <FinishSale venta={venta} onClose={()=>setOpenFinishSale(false)}/>
          </Modal>
        }
        {
          openConfirm &&
          <Confirm
            confirmAction={finishSale}
            handleClose={()=>setOpenConfirm(false)}
            loading={loading}
            open={openConfirm}
          />
        }
    </Container>
  )
}

function calculateCuotas (total, dineroIngresado) {
  return [
      {
          cantidad: 1,
          descripcion:`1 x ${(((total-dineroIngresado))/1).toFixed(2)}`
      },
      {
          cantidad: 3,
          descripcion:`3 x ${(((total-dineroIngresado))/3).toFixed(2)}`
      },
      {
          cantidad: 6,
          descripcion:`6 x ${(((total-dineroIngresado))/6).toFixed(2)}`
      },
      {
          cantidad: 12,
          descripcion:`12 x ${(((total-dineroIngresado))/12).toFixed(2)}`
      }
  ]
}

const Container = styled.div `
  display:flex;
  flex-direction: column;
  flex: 1;
`

const ContainerSelected = styled.div `
  display:flex;
  flex: 1;
  @media only screen and (max-width: 800px) {
    flex-direction: column;
  }
`
