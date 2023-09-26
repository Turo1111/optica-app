import React, { useEffect, useState } from 'react'
import Button from '../Button';
import Loading from '../Loading';
import { useAppDispatch } from '@/redux/hook';
import { useFormik } from 'formik';
import InputSelect from '../InputSelect';
import Confirm from '../Confirm';
import apiClient from '@/utils/client';
import { useInputValue } from '@/hooks/useInputValue';
import { useSearch } from '@/hooks/useSearch';
import InputSearch from '../InputSearch';
import ItemCartProduct from '../NuevaVenta/ItemCartProduct';
import styled from 'styled-components';
import EmptyList from '../EmptyList';
import { setAlert } from '@/redux/alertSlice';
import InputSelectAdd from '../InputSelectAdd';
import Input from '../Input';
import Modal from '../Modal';
import NewProduct from '../Productos/NewProduct';
import { io } from 'socket.io-client';
import TextArea from '../TextArea';
import { BsTrash } from 'react-icons/bs';

export default function NewCompra({handleClose, token}) {

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [productos, setProductos] = useState([])
    const search = useInputValue('','')
    const [tagSearch, setTagSearch] = useState([])
    const [productSelected, setProductSelected] = useState([])
    const [openNewProduct, setOpenNewProduct] = useState(false)
    const fecha = new Date()

    const tag = ["descripcion", "codigo", "categoria", "color", "alto", "ancho", "marca", "numeracion"]

    const listProducto = useSearch(search.value, tag, productos, tagSearch) 

    const formik = useFormik({
        initialValues: {
            idSucursal: '',
            sucursal: '',
            proveedor: '',
            idProveedor: '',
            observacion: '',
            total: 0
        },
        validateOnChange: false,
        onSubmit: async (formValue) => {
            if (formValue.idSucursal === '') {
                dispatch(setAlert({
                  message: 'No se selecciono una sucursal',
                  type: 'warning'
                }))
                return
            }
            if (formValue.idProveedor === '') {
                dispatch(setAlert({
                  message: 'No se selecciono un proveedor',
                  type: 'warning'
                }))
                return
            }
            if (productSelected.length === 0) {
                dispatch(setAlert({
                  message: 'No se selecciono ningun producto',
                  type: 'warning'
                }))
                return
            }
            let compra = {
                idSucursal: formValue.idSucursal,
                idProveedor: formValue.idProveedor,
                observacion: formValue.observacion,
                total: formValue.total,
                fecha: fecha
            }
            let idCompra = ''
            await apiClient.post(`/compra`, compra,
            {
              headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
            .then(r=>{
              handleClose()
              dispatch(setAlert({
                message: 'Compra creada correctamente',
                type: 'success'
              }))
              setLoading(false)
              idCompra = r.data.body._id
            })
            .catch(e=>{
              setLoading(false)
              dispatch(setAlert({
              message: `${e.response.data.error || 'Ocurrio un error'}`,
              type: 'error'
            }))})
            productSelected.forEach(async (lineaVenta) => {
              let lv = {
                cantidad: lineaVenta.cantidad,
                precio: lineaVenta.precioCompra,
                idProducto: lineaVenta._id,
                idCompra: idCompra
              }
              await apiClient.post(`/lineacompra`, lv,
              {
                headers: {
                  Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
                }
              })
              .then(r=>{
                handleClose()
                dispatch(setAlert({
                  message: 'Compra creada correctamente',
                  type: 'success'
                }))
                setLoading(false)
                idCompra = r.data.body._id
              })
              .catch(e=>{
                setLoading(false)
                dispatch(setAlert({
                message: `${e.response.data.error || 'Ocurrio un error'}`,
                type: 'error'
              }))}) 
              await apiClient.get(`/stock/${lineaVenta._id}`, 
              {
                headers: {
                  Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
                }
              })
              .then(async r=>{
                let existe = r.data.body.find(itemStock => itemStock.idSucursal === compra.idSucursal) 
                if(existe) {
                  await apiClient.patch(`/stock/${existe._id}`, {
                    cantidad: parseFloat(existe.cantidad)+parseFloat(lineaVenta.cantidad)
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
                    }
                  })
                  .then(r=>{
                  })
                  .catch(e=>{
                    dispatch(setAlert({
                    message: `${e.response.data.error || 'Ocurrio un error'}`,
                    type: 'error'
                  }))})
                }else{
                  await apiClient.post(`/stock`, {
                    cantidad: parseFloat(lineaVenta.cantidad),
                    idProducto: lineaVenta._id,
                    idSucursal: compra.idSucursal,
                    precioEfectivo: 1,
                    precioLista: 1
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
                    }
                  })
                  .then(r=>{
                  })
                  .catch(e=>{
                    dispatch(setAlert({
                    message: `${e.response.data.error || 'Ocurrio un error'}`,
                    type: 'error'
                  }))})
                }
                
              })
              .catch(e=>{
                dispatch(setAlert({
                message: `${e.response.data.error || 'Ocurrio un error'}`,
                type: 'error'
              }))}) 
            })
        }
    })

    useEffect(() => {
        setLoading(true)
        apiClient.get(`/producto`,{
          headers: {
            Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
        .then((r)=>{
          setLoading(false)
          setProductos(r.data.body)
        })
        .catch((e)=>dispatch(setAlert({
          message: 'Error en el servidor, revise el estado',
          type: 'error'
        })))
    }, [token, dispatch])

    useEffect(()=>{
        if (typeof window !== 'undefined') {
          const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
          socket.on('producto', (producto) => {
            setProductos((prevData)=>{
              const exist = prevData.find(elem => elem._id === producto.res._id )
              if (exist) {
                return prevData.map((item) =>
                item._id === producto.res._id ? producto.res : item
              )
              }
              return [...prevData, producto.res]
            })
          })
          return () => {
            socket.disconnect();
          }; 
        }
    },[productos])

    useEffect(()=>{
        const initialValue = 0
        const sumTotal = productSelected.reduce( (accumulator, currentValue) => {
            return (parseFloat(accumulator) + (parseFloat(currentValue.precioCompra*currentValue.cantidad))).toFixed(2)
        }, initialValue)
        formik.setFieldValue('total', sumTotal)
    },[productSelected])

  return (
    <div>
        <InputSelectAdd label={"Proveedor"} type='text' value={formik.values.idProveedor} onChange={(id, item)=>{
          formik.setFieldValue('idProveedor', id)
          formik.setFieldValue('proveedor', item.descripcion)
        }} name='proveedor' />
        
        <ContainerSearch>
          <InputSearch placeholder={'Buscar Productos'} {...search} width='100%' data={listProducto} modal={true} prop={'descripcion'} 
          onSelect={(item)=>{
            if (item._id === '64f0c9e9ae80e2477accbc14' || item._id === '64f0ca05ae80e2477accbc24') {
              dispatch(setAlert({
                message: 'No es posible seleccionar este producto',
                type: 'warning'
              }))
              return
            }
            setProductSelected(prevData=>{
                const exist = prevData.find(elem => elem._id === item._id )
                if (exist) {
                    dispatch(setAlert({
                      message: 'Producto ya agregado',
                      type: 'warning'
                    }))
                    return prevData
                }
                return [...prevData, {...item, cantidad: 1, precioCompra: 1}]
            })
            /* setOpenAddProduct(true) */
          }} 
          tags={tag}
          tagSearch={tagSearch}
          deleteTagSearch={(item) => setTagSearch((prevData) => prevData.filter((elem) => elem.tag !== item.tag))}
          onSelectTag={(search, tag) =>
            tag !== 'SIN ETIQUETA' &&
            setTagSearch((prevData) =>
              !prevData.find((elem) => elem.tag === tag) ? [...prevData, { search, tag }] : prevData
          )}
          />
          <Button text={'NUEVO'} onClick={() => setOpenNewProduct(true)} />
        </ContainerSearch>
        <List>
            {
              productSelected.length === 0 ?
              <div>Sin elementos agregados</div>
              :
              productSelected.map((item, index) => (
                <div style={{display: 'flex', alignItems: 'center'}} key={item._id} >
                    <IconWrapper bg={process.env.RED_ALERT} onClick={()=>setProductSelected(prevData=>prevData.filter(itemPrev=>itemPrev._id!==item._id))}>
                        <BsTrash/>
                    </IconWrapper>
                    <h3 style={{width: 2000, color: `${process.env.TEXT_COLOR}`, textAlign: 'center'}} >{item.descripcion}</h3>
                    <Input label={"Cantidad"} type='number' name='cantidad' value={item.cantidad} onChange={(e)=>{
                        e.target.value > 0 && setProductSelected(prevData=>prevData.map(itemPrev=>itemPrev._id === item._id ? {...itemPrev, cantidad: e.target.value} : itemPrev))
                    }} />
                    <Input label={"Precio Compra (unidad)"} type='number' name='precioCompra' prefix={'$'} value={item.precioCompra}
                        onChange={(e)=>{
                            e.target.value > 0 && setProductSelected(prevData=>prevData.map(itemPrev=>itemPrev._id === item._id ? {...itemPrev, precioCompra: e.target.value} : itemPrev))
                        }}
                    />
                </div>
              ))
            }
        </List>
        <InputSelect label={"Sucursal"} type='text' name='sucursal' value={formik.values.sucursal}  onChange={(id, item)=>{
            formik.setFieldValue('idSucursal', id)
            formik.setFieldValue('sucursal', item.descripcion)
          }}
        />
        <TextArea label={"Observacion"} name='observacion' value={formik.values.observacion} onChange={formik.handleChange} />
        <Tag color={process.env.TEXT_COLOR} style={{textAlign: 'end'}} > Total : $ {formik.values.total} </Tag>
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 15}}>
          {
            loading ? 
            <Loading />:
            <>
              <Button text={'CANCELAR'} onClick={handleClose}/>
              <Button text={'ACEPTAR'} onClick={()=>setOpenConfirm(true)}/>
            </>
          }
        </div>
        {
          openConfirm &&
          <Confirm
            confirmAction={formik.handleSubmit}
            handleClose={()=>setOpenConfirm(false)}
            loading={loading}
            open={openConfirm}
          />
        }
        {
            openNewProduct &&
                <Modal
                  open={openNewProduct}
                  title={'Nuevo Producto'}
                  height='90%'
                  width='50%'
                  eClose={()=>setOpenNewProduct(false)}
                >
                  <NewProduct eClose={()=>setOpenNewProduct(false)} token={token}/>
                </Modal>
      }
    </div>
  )
}

const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  margin:0;
  margin-top: 8px;
  overflow-y: scroll;
  max-height: 350px;
  @media only screen and (max-width: 800px) {
    height: 350px
  }
`

const ContainerSearch = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media only screen and (max-width: 445px) {
    flex-direction: column;
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