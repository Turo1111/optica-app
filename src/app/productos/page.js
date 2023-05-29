'use client'
import Button from '@/components/Button'
import Dashboard from '@/components/Dashboard'
import InfoProduct from '@/components/InfoProduct'
import InputSearch from '@/components/InputSearch'
import ItemProducto from '@/components/ItemProducto'
import Modal from '@/components/Modal'
import NewProduct from '@/components/NewProduct'
import React, { useState } from 'react'

export default function Productos() {

  const [openNewProduct, setOpenNewProduct] = useState(false)
  const [openInfoProduct, setOpenInfoProduct] = useState(false)

  return (
    <div style={{display: 'flex'}}>
      <Dashboard/>
      <div style={{ flex: 1, display: 'flex', padding: 15 }}>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: 25, backgroundColor: '#EEEEEE', borderRadius: 25}} >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <InputSearch placeholder={'Buscar Productos'} />
            <Button text={'NUEVO'} onClick={()=>setOpenNewProduct(true)} />
          </div> 
          <ul style={{flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0 }}>
            {
              [1,2,3,4,5].map((item, index)=><ItemProducto key={index} handleOpenModal={()=>setOpenInfoProduct(true)}>{item}</ItemProducto>)
            }
          </ul>
        </div>
      </div>
      <Modal eClose={()=>setOpenNewProduct(false)} open={openNewProduct} title={'Nuevo Producto'} height='90%' width='40%' >
        <NewProduct eClose={()=>setOpenNewProduct(false)}/>
      </Modal>
      <Modal eClose={()=>setOpenInfoProduct(false)} open={openInfoProduct} title={'Info del Producto'} height='90%' width='50%' >
        <InfoProduct/>
      </Modal>
    </div>
  )
}
