'use client'
import Button from '@/components/Button'
import EmptyList from '@/components/EmptyList'
import InputSearch from '@/components/InputSearch'
import ItemProducto from '@/components/ItemProducto'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import NotPermissions from '@/components/NotPermissions'
import EditProduct from '@/components/Productos/EditProduct'
import InfoProduct from '@/components/Productos/InfoProduct'
import NewProduct from '@/components/Productos/NewProduct'
import NewTransfer from '@/components/Productos/NewTransfer'
import UpdateProduct from '@/components/Productos/UpdateProduct'
import Table from '@/components/Table'
import { useInputValue } from '@/hooks/useInputValue'
import { useSearch } from '@/hooks/useSearch'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { getUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import styled from 'styled-components'
const io = require('socket.io-client')

export default function Productos() {
  const [openNewProduct, setOpenNewProduct] = useState(false)
  const [openInfoProduct, setOpenInfoProduct] = useState(false)
  const [openEditProduct, setOpenEditProduct] = useState(false)
  const [productSelected, setProductSelected] = useState(undefined)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const user = useAppSelector(getUser);
  const [permission, setPermission] = useState(false)
  const dispatch = useAppDispatch();
  const [openNewTransfer, setOpenNewTransfer] = useState(false)
  const [tagSearch, setTagSearch] = useState([])
  const [openUpdate, setOpenUpdate] = useState(false)

  const search = useInputValue('','')

  const tag = ["descripcion", "codigo", "categoria", 'proveedor', "color", "alto", "ancho", "marca", "numeracion"]

  const listProducto = useSearch(search.value, tag, data, tagSearch)

  const getProducto = () => {
    setLoading(true)
    if (user.token) {
      apiClient.get('/producto' ,
      {
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
        .then(r => {
          setData((prevData)=>{
            setLoading(false)
            return r.data.body
          })
        })
        .catch(e => dispatch(setAlert({
          message: `${e.response.data.error || 'Ocurrio un error'}`,
          type: 'error'
        })))
    }
  }

  useEffect(()=>{
    if (user.usuario !== '') {  
      user.roles.permisos.forEach((permiso) => {
          if (permiso.screen.toLowerCase() === 'producto') {
            if (!permiso.lectura) {
              return setPermission(false)
            }
            return setPermission(true)
          }
      });
    }
  },[user])

  useEffect(() => {
    getProducto()
    return
  }, [user.token])

  useEffect(()=>{
    const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
    socket.on('producto', (producto) => {
      getProducto()
    })
    return () => {
      socket.disconnect();
    }; 
  }, [data])

  useEffect(()=>{
    if (openNewProduct || openEditProduct || openNewTransfer || openUpdate) {
      user.roles.permisos.forEach((permiso) => {
        if (permiso.screen.toLowerCase() === 'producto') {
          if (!permiso.escritura) {
            setOpenNewProduct(false)
            setOpenEditProduct(false)
            setOpenNewTransfer(false)
            setOpenUpdate(false)
            dispatch(setAlert({
              message: 'NO TIENES PERMISOS DE USUARIO',
              type: 'error'
            }))
          }
        }
      });
    }
  },[openNewProduct, openEditProduct, openNewTransfer, openUpdate])

  const handleOpenInfoModal = (item) => {
    setProductSelected(item)
    setOpenInfoProduct(true)
  }

  const handleOpenEditModal = (item) => {
    setProductSelected(item)
    setOpenEditProduct(true)
    setOpenInfoProduct(false)
  }

  const handleOpenTransferModal = (item) => {
    setProductSelected(item)
    setOpenNewTransfer(true)
    setOpenInfoProduct(false)
  }

  const handleCloseModals = () => {
    setProductSelected(undefined)
    setOpenNewProduct(false)
    setOpenInfoProduct(false)
    setOpenEditProduct(false)
    setOpenNewTransfer(false)
    setOpenUpdate(false)
  }

  /* useEffect(()=>{
    if (!openUpdate) {
      getProducto()
    }
  }, [openUpdate]) */

  if (!permission) {
    return <NotPermissions/>
  }

  return (
    <>
      {
        loading ? 
        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Loading/>
        </div> 
        :
        <>
          <ContainerSearch>
            <InputSearch
              placeholder={'Buscar Productos'}
              {...search}
              tags={tag}
              tagSearch={tagSearch}
              deleteTagSearch={(item) => setTagSearch((prevData) => prevData.filter((elem) => elem.tag !== item.tag))}
              onSelectTag={(search, tag) =>
                tag !== 'SIN ETIQUETA' &&
                setTagSearch((prevData) =>
                  !prevData.find((elem) => elem.tag === tag) ? [...prevData, { search, tag }] : prevData
                )
              }
              width="80%"
            />
            <Button text={'ACTUALIZAR'} onClick={() => setOpenUpdate(true)} />
            <Button text={'NUEVO'} onClick={() => setOpenNewProduct(true)} />
          </ContainerSearch>
          <Table data={listProducto} columns={columns} maxHeight={false} onClick={(item) => handleOpenInfoModal(item)}/>
        </>
      }
      {
        openNewProduct &&
        <Modal
          open={openNewProduct}
          title={'Nuevo Producto'}
          height='90%'
          width='50%'
          eClose={handleCloseModals}
        >
          <NewProduct eClose={handleCloseModals} token={user.token}/>
        </Modal>
      }
      {
        openUpdate && 
        <Modal
          open={openUpdate}
          title={'Actualizacion de precios'}
          height='auto'
          width='50%'
          eClose={handleCloseModals}
        >
          <UpdateProduct data={data} eClose={handleCloseModals} token={user.token}/>
        </Modal>
      }
      {productSelected && (
        <>
          <Modal
            open={openEditProduct}
            title={'Editar Producto'}
            height='90%'
            width='50%'
            eClose={handleCloseModals}
          >
            <EditProduct item={productSelected} eClose={handleCloseModals} token={user.token} />
          </Modal>
          <Modal
            open={openInfoProduct}
            title={'Info del Producto'}
            height='90%'
            width='50%'
            eClose={handleCloseModals}
          >
            <InfoProduct item={productSelected} token={user.token} 
              handleOpenEditModal={(item) => handleOpenEditModal(item)}
              handleOpenTransferModal={(item) => handleOpenTransferModal(item)} 
            />
          </Modal>
          <Modal
            open={openNewTransfer}
            title={'Transferencia de stock'}
            height='auto'
            width='40%'
            eClose={handleCloseModals}
          >
            <NewTransfer item={productSelected} token={user.token} handleClose={handleCloseModals} />
          </Modal>
        </>
      )}
    </>
  )
}

const columns = [
  { label: 'Producto', field: 'descripcion', width: '35%' },
  { label: 'Codigo', field: 'codigo', width: '25%', align: 'center' },
  { label: 'Categoria', field: 'categoria', width: '20%', align: 'center' },
  { label: 'Precio', field: 'precioGeneral', width: '20%', align: 'center', price: true },
];

const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  overflow-y: scroll;
`
const ContainerSearch = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media only screen and (max-width: 445px) {
    flex-direction: column;
  }
`
