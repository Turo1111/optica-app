import { useInputValue } from '@/hooks/useInputValue'
import { useSearch } from '@/hooks/useSearch'
import React, { useState } from 'react'
import InputSearch from '../InputSearch'
import Table from '../Table'
import Input from '../Input'
import Button from '../Button'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import apiClient from '@/utils/client'
import Loading from '../Loading'
import Confirm from '../Confirm'

export default function UpdateProduct({data, eClose, token}) {

    const [tagSearch, setTagSearch] = useState([])
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch();
    const [openConfirm, setOpenConfirm] = useState(false)
  
    const search = useInputValue('','')
    const porcentaje = useInputValue(0, 'number')
  
    const tag = ["descripcion", "codigo", "categoria", 'proveedor', "color", "alto", "ancho", "marca", "numeracion"]
  
    const listProducto = useSearch(search.value, tag, data, tagSearch)

    const handleUpdate = async () => {
      if (listProducto.length === 0) {
        dispatch(setAlert({
          message: 'Sin productos filtrados',
          type: 'warning'
        }))
        return
      }
      if (porcentaje.value <= 0) {
        dispatch(setAlert({
          message: 'El porcentaje tiene que ser mayor a 0',
          type: 'warning'
        }))
        return
      }
      const promises = []
      listProducto.forEach((item, index)=>{
        let precio = (parseFloat(item.precioGeneral+(item.precioGeneral*parseFloat(porcentaje.value)/100))).toFixed(2)
        const promise1 = apiClient.patch(`/producto/${item._id}`, {...item ,precioGeneral: precio} ,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token en el encabezado como "Bearer {token}"
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(r=>{
          return r.data;
        })
        .catch(e=>{
          dispatch(setAlert({
            message: `${e.response.data.error || 'Ocurrio un error'}`,
            type: 'error'
          }))
        })  
        promises.push(promise1)
        const promise2 = apiClient.patch(`/stock/updateprice/${item._id}`, {
          precioEfectivo: precio,
          precioLista: (parseFloat(precio)+(parseFloat(precio)*0.20)).toFixed(2)
        } ,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
        .then(r=>{
          return r.data;
        })
        .catch(e=>{
          dispatch(setAlert({
            message: `${e.response.data.error || 'Ocurrio un error'}`,
            type: 'error'
          }))
        }) 
        promises.push(promise2)
      })
      await Promise.all(promises)
      setLoading(false)
      eClose()
    }

  return (
    <div style={{padding: 15}} >
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
        <Input label={"Porcentaje"} type='number' name='porcentaje' value={porcentaje.value} onChange={porcentaje.onChange} />
        <div style={{height: 300}} >
            <Table data={listProducto} columns={columns} maxHeight={true} onClick={(item) => ''}  />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          {
            loading ? 
            <Loading />:
            <>
              <Button text={'CANCELAR'} onClick={eClose}/>
              <Button text={'ACTUALIZAR'} onClick={()=>setOpenConfirm(true)}/>
            </>
          }
        </div>
        {
              openConfirm &&
              <Confirm
                confirmAction={handleUpdate}
                handleClose={()=>setOpenConfirm(false)}
                loading={loading}
                open={openConfirm}
              />
            }
    </div>
  )
}

const columns = [
    { label: 'Producto', field: 'descripcion', width: '35%' },
    { label: 'Codigo', field: 'codigo', width: '25%', align: 'center' },
    { label: 'Categoria', field: 'categoria', width: '20%', align: 'center' },
    { label: 'Precio', field: 'precioGeneral', width: '20%', align: 'center', price: true },
  ];