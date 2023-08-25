'use client'
import Button from '@/components/Button'
import NewEditCliente from '@/components/Clientes/NewEditCliente'
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
            if (obraSocialSelected) {
              setObraSocialSelected(obraSocialSelected)
            }
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
      if (parseFloat(dineroIngresado) > parseFloat(total)) {
        dispatch(setAlert({
          message: 'No se puede ingresar un valor mayor al total',
          type: 'error'
        }))
        return;
      }
      if ( clientSelected._id === '64c95db35ae46355b5f7df64' && parseFloat(dineroIngresado).toFixed(2) < parseFloat(total).toFixed(2)) {
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
        setLoading(true)
        if (useSenia) {
          apiClient.patch(`/senia/${clientSelected.senia._id}`, {estado: false},{
            headers: {
              Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
            }
          })
          .then(r=>console.log(r))
          .catch(e=>{
            setLoading(false)
            dispatch(setAlert({
            message: `${e.response.data.error}`,
            type: 'error'
          }))})
        }
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
                      .catch(e=>{
                        setLoading(false)
                        dispatch(setAlert({
                        message: `${e.response.data.error}`,
                        type: 'error'
                      }))})
                    
                  })
                  .catch(e=>{
                    setLoading(false)
                    dispatch(setAlert({
                    message: `${e.response.data.error}`,
                    type: 'error'
                  }))}) 
                })
              })
              .catch(e=>{
                setLoading(false)
                dispatch(setAlert({
                message: `${e.response.data.error}`,
                type: 'error'
              }))}) 
          })
          .catch(e=>{
            setLoading(false)
            dispatch(setAlert({
            message: `${e.response.data.error}`,
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
                  .catch(e=>{
                    setLoading(false)
                    dispatch(setAlert({
                    message: `${e.response.data.error}`,
                    type: 'error'
                  }))})
                })
                .catch(e=>{
                  setLoading(false)
                  dispatch(setAlert({
                  message: `${e.response.data.error}`,
                  type: 'error'
                }))}) 
              })
            })
            .catch(e=>{
              setLoading(false)
              dispatch(setAlert({
              message: `${e.response.data.error}`,
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
      .catch((e)=>console.log('error',e))
      apiClient.get(`/cliente`,{
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
      .then((r)=>{
        setLoadingData(false)
        setClientes(r.data.body)
      })
      .catch((e)=>console.log('error',e))
    }, [user.token])

    /* useEffect(()=>{
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
      
    },[cart, pago, obraSocialSelected]) */
    
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
      console.log("carrito",cart, 'datacard', dataCard);
      const initialValue = 0
      const sumTotal = cart?.reduce( (accumulator, currentValue) => {
          return (parseFloat(accumulator) + parseFloat(currentValue.total)).toFixed(2)
      }, initialValue)
      if(pago.descripcion === 'EFECTIVO' || pago.descripcion === 'CUENTA CORRIENTE' ){
        console.log('EFECTIVO o CC');
        setSubTotal(parseFloat(sumTotal))
        setTotal(parseFloat(sumTotal)-descuento)
        return;
      }
      if(pago.descripcion === 'TARJETA'){
        console.log('TARJETA', sumTotal);
        setSubTotal(parseFloat(sumTotal))
        setTotal( (parseFloat(sumTotal)+(parseFloat(sumTotal)*(20/100)))-descuento)
        return;
      }
      if(pago.descripcion === 'EFECTIVO Y TARJETA'){
        console.log('eyt', sumTotal, ((sumTotal-dineroIngresado)+((sumTotal-dineroIngresado)*(20/100))));
        setSubTotal((parseFloat(sumTotal)).toFixed(2))
        setTotal( ((parseFloat(dineroIngresado) + ((sumTotal-dineroIngresado)+((sumTotal-dineroIngresado)*(20/100))))-descuento).toFixed(2))
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
        setDescuento(descuento)
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
          setDescuento(descuentoTotal)
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
          deleteItemCart={(id)=>setCart((prevData)=>prevData.filter(elem=>elem._id!==id))}
          changeCart={(item)=>{
            setCart((prevData)=>prevData.map(elem=>elem._id===item._id ? item : elem))
          }}
          onSelectProduct={(item)=>{
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
            if (clientSelected?.senia) {
              setDineroIngresado(clientSelected?.senia?.saldo)
              setUseSenia(!useSenia)
            }
          }}
        />
      </ContainerSelected>
        <DataSale
          pago={pago}
          onChangeTipoPago={(_id, item)=>{
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
          finishSale={finishSale}
          dineroIngresado={dineroIngresado}
          onChangeDineroIngresado={(e)=>setDineroIngresado(e.target.value)}
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
                if (parseFloat(e.target.value) >= parseFloat(total)) {
                  dispatch(setAlert({
                    message: 'Necesita completar los datos',
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
    </Container>
  )
}

function calculateCuotas (total, dineroIngresado) {
  console.log("cuotas", (total), (total-dineroIngresado)*(20/100));
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
