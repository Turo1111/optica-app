'use client'
import Button from '@/components/Button'
import InputSearch from '@/components/InputSearch'
import ItemProducto from '@/components/ItemProducto'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import EditProduct from '@/components/Productos/EditProduct'
import InfoProduct from '@/components/Productos/InfoProduct'
import NewProduct from '@/components/Productos/NewProduct'
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

  useEffect(() => {
    setLoading(true)
    apiClient.get('/productoa')
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

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <div style={{ flex: 1, display: 'flex', padding: 15 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 25, backgroundColor: '#EEEEEE', borderRadius: 25 }} >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputSearch placeholder={'Buscar Productos'} />
            <Button text={'NUEVO'} onClick={() => setOpenNewProduct(true)} />
          </div>
          {
            loading ? 
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Loading/>
            </div> 
            :
            <ul style={{ flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0 }}>
              {
                data.length === 0 ?
                <h2>No hay productos creados</h2>
                :
                data.map((item, index) => (
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