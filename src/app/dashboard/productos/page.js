'use client'
import Button from '@/components/Button'
import EmptyList from '@/components/EmptyList'
import InputSearch from '@/components/InputSearch'
import ItemProducto from '@/components/ItemProducto'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import EditProduct from '@/components/Productos/EditProduct'
import InfoProduct from '@/components/Productos/InfoProduct'
import NewProduct from '@/components/Productos/NewProduct'
import { useInputValue } from '@/hooks/useInputValue'
import { useSearch } from '@/hooks/useSearch'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { getUser } from '@/redux/userSlice'
import apiClient from '@/utils/client'
import React, { useEffect, useState } from 'react'
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

  const search = useInputValue('','')

  const tag = ["descripcion", "codigo"]

  const listProducto = useSearch(search.value, tag, data)

  useEffect(()=>{
      user.roles.permisos.forEach((permiso) => {
          if (permiso.screen.toLowerCase() === 'producto') {
            if (!permiso.lectura) {
              return setPermission(false)
            }
            return setPermission(true)
          }
      });
  },[])

    

  useEffect(() => {
    setLoading(true)
    apiClient.get('/producto')
      .then(r => {
        setData((prevData)=>{
          setLoading(false)
          return r.data.body
        })
      })
      .catch(e => console.log(e))
  }, [])

  useEffect(()=>{
    const socket = io('http://localhost:3001')
    socket.on('producto', (producto) => {
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
        if (permiso.screen.toLowerCase() === 'producto') {
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

  const handleCloseModals = () => {
    setProductSelected(undefined)
    setOpenNewProduct(false)
    setOpenInfoProduct(false)
    setOpenEditProduct(false)
  }

  if (!permission) {
    return <h2>no tiene permisos</h2>
  }

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <div style={{ flex: 1, display: 'flex', padding: 15 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 25, backgroundColor: '#EEEEEE', borderRadius: 25 }} >
          {
            loading ? 
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Loading/>
            </div> 
            :
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <InputSearch placeholder={'Buscar Productos'} {...search} />
                <Button text={'NUEVO'} onClick={() => setOpenNewProduct(true)} />
              </div>
              <ul style={{ flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0 }}>
                {
                  listProducto.length === 0 ?
                  <EmptyList onClick={() => setOpenNewProduct(true)} />
                  :
                  listProducto.map((item, index) => (
                    <ItemProducto
                      key={index}
                      handleOpenInfoModal={() => handleOpenInfoModal(item)}
                      handleOpenEditModal={() => handleOpenEditModal(item)}
                      item={item}
                    >
                      {item}
                    </ItemProducto>
                  ))
                }
              </ul>
            </>
          }
        </div>
      </div>
      <Modal
        open={openNewProduct}
        title={'Nuevo Producto'}
        height='90%'
        width='40%'
        eClose={handleCloseModals}
      >
        <NewProduct eClose={handleCloseModals} />
      </Modal>
      {productSelected && (
        <>
          <Modal
            open={openEditProduct}
            title={'Editar Producto'}
            height='90%'
            width='40%'
            eClose={handleCloseModals}
          >
            <EditProduct item={productSelected} eClose={handleCloseModals} />
          </Modal>
          <Modal
            open={openInfoProduct}
            title={'Info del Producto'}
            height='90%'
            width='40%'
            eClose={handleCloseModals}
          >
            <InfoProduct item={productSelected} />
          </Modal>
        </>
      )}
    </div>
  )
}