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

  const search = useInputValue('','')

  const tag = ["descripcion", "codigo", "categoria", "color", "alto", "ancho", "marca", "numeracion"]

  const listProducto = useSearch(search.value, tag, data, tagSearch)

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
    setLoading(true)
    if (user.token) {
      apiClient.get('/producto' ,
      {
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
        .then(r => {
          console.log(r.data.body);
          setData((prevData)=>{
            setLoading(false)
            return r.data.body
          })
        })
        .catch(e => dispatch(setAlert({
          message: `${e}`,
          type: 'error'
        })))
    }
  }, [user.token])

  useEffect(()=>{
    const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
    socket.on('producto', (producto) => {
      console.log(producto)
      setData((prevData)=>{
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
  },[data])

  useEffect(()=>{
    if (openNewProduct || openEditProduct) {
      user.roles.permisos.forEach((permiso) => {
        if (permiso.screen.toLowerCase() === 'venta') {
          if (!permiso.escritura) {
            setOpenNewProduct(false)
            setOpenEditProduct(false)
            dispatch(setAlert({
              message: 'NO TIENES PERMISOS DE USUARIO',
              type: 'error'
            }))
          }
        }
      });
    }
  },[openNewProduct, openEditProduct])

  const handleOpenInfoModal = (item) => {
    setProductSelected(item)
    setOpenInfoProduct(true)
  }

  const handleOpenEditModal = (item) => {
    setProductSelected(item)
    setOpenEditProduct(true)
  }

  const handleOpenTransferModal = (item) => {
    setProductSelected(item)
    setOpenNewTransfer(true)
  }

  const handleCloseModals = () => {
    setProductSelected(undefined)
    setOpenNewProduct(false)
    setOpenInfoProduct(false)
    setOpenEditProduct(false)
    setOpenNewTransfer(false)
  }

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
            <Button text={'NUEVO'} onClick={() => setOpenNewProduct(true)} />
          </ContainerSearch>
          <List>
            {
              listProducto.length === 0 ?
              <EmptyList onClick={() => setOpenNewProduct(true)} />
              :
              listProducto.map((item, index) => (
                <ItemProducto
                  key={index}
                  handleOpenInfoModal={() => handleOpenInfoModal(item)}
                  handleOpenEditModal={() => handleOpenEditModal(item)}
                  handleOpenTransferModal={() => handleOpenTransferModal(item)}
                  item={item}
                >
                  {item}
                </ItemProducto>
              ))
            }
          </List>
        </>
      }
      <Modal
        open={openNewProduct}
        title={'Nuevo Producto'}
        height='90%'
        width='50%'
        eClose={handleCloseModals}
      >
        <NewProduct eClose={handleCloseModals} token={user.token}/>
      </Modal>
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
            <InfoProduct item={productSelected} token={user.token} />
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
