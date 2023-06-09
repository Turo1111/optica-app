import React, { useEffect, useState } from 'react'
import InputSearch from '../InputSearch'
import Button from '../Button'
import Table from '../Table'
import NewEditObraSocial from './NewEditObraSocial'
import apiClient from '@/utils/client'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
const io = require('socket.io-client')

export default function ObraSocial() {

  const dispatch = useAppDispatch();

    const [openNewEdit, setOpenNewEdit] = useState(false)
    const [selected, setSelected] = useState(null)
    const [data, setData] = useState([])

    useEffect(()=>{
      apiClient.get('/obrasocial')
      .then(r=>setData(r.data.body))
      .catch(e=>dispatch(setAlert({
        message: 'Hubo un error inesperado al cargar las obras sociales',
        type: 'error'
      })))
    },[])

    useEffect(()=>{
      const socket = io('http://localhost:3001')
      socket.on('obraSocial', (obraSocial) => {
        setData((prevData)=>{
          const exist = prevData.find(elem => elem._id === obraSocial.res._id )
          if (exist) {
            return prevData.map((item) =>
            item._id === obraSocial.res._id ? obraSocial.res : item
          )
          }
          return [...prevData, obraSocial.res]
        })
      })
      return () => {
        socket.disconnect();
      }; 
    },[data])

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: 25}} >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <InputSearch placeholder={'Buscar Obra Social'} />
        <Button text={'NUEVO'} onClick={()=>setOpenNewEdit(true)} />
      </div> 
      {
        openNewEdit ? 
        <NewEditObraSocial handleClose={()=>{
            setSelected(null)
            setOpenNewEdit(false)
        }} 
        item={selected} edit={selected && true} 
        />
        :
        <Table data={data} columns={columns} onClick={(item)=>{
            setSelected(item)
            setOpenNewEdit(true)
        }} 
        />
        
      }
    </div>
  )
}

const columns = [
    { label: 'Obra social', field: 'descripcion', width: '30%' },
    { label: 'Tipo', field: 'tipoDescuento', width: '15%' },
    { label: 'Descuento', field: 'cantidadDescuento', width: '20%', align: 'center' },
    { label: 'Devolucion', field: 'cantidadDevuelta', width: '20%', align: 'center' },
    { label: 'Productos', field: 'cantidadProductos', width: '15%', align: 'center' },
  ];

{/* <ul style={{flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0 }}>
            {
                [1,2,3,4,5].map((item,index)=>(
                    <li key={index} style={{ listStyle: 'none', margin: '15px' }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}} >
                            <label style={{fontSize: 18, fontWeight: 500, color: `${process.env.TEXT_COLOR}`}}>Enrique Serra</label>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}} >
                            <label style={{fontSize: 16, fontWeight: 400, color: `${process.env.TEXT_COLOR}`}}>Tipo descuento : porcentaje</label>
                            <label style={{fontSize: 16, fontWeight: 400, color: `${process.env.TEXT_COLOR}`}}>31613561616</label>
                        </div>
                    </li>
                ))
            }
        </ul> */}