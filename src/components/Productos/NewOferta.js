import { setAlert } from '@/redux/alertSlice';
import { useAppDispatch } from '@/redux/hook';
import React, { useEffect, useState } from 'react'
import Input from '../Input';
import { useFormik } from 'formik';
import InputSelect from '../InputSelect';
import Button from '../Button';
import { useInputValue } from '@/hooks/useInputValue';
import { useSearch } from '@/hooks/useSearch';
import styled from 'styled-components';
import InputSearch from '../InputSearch';
import apiClient from '@/utils/client';
import Loading from '../Loading';

export default function NewOferta({item, token, eClose, producto}) {

    console.log(item)

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [selectedItems, setSelectedItems] = useState(item?.sucursales || []);
    const search = useInputValue('','')
    const tag = ["descripcion"]
    const listSucursales = useSearch(search.value, tag, data)

    const formik = useFormik({
        initialValues: initialValues(item),
        validateOnChange: false,
        onSubmit: (formValue) => {
            formValue.sucursales = selectedItems;
            formValue.idProducto= producto._id
            console.log(formValue.fechaFinal <= formValue.fechaInicio);
            console.log(formValue.fechaFinal,formValue.fechaInicio);
            if (formValue.fechaFinal <= formValue.fechaInicio) {
                dispatch(setAlert({
                    message: 'Fecha final debe ser posterior a la de inicio',
                    type: 'warning'
                  }))
                  return
            }
            if (formValue.descuento <= 0) {
                dispatch(setAlert({
                    message: 'El descuento tiene que ser mayor a 0',
                    type: 'warning'
                  }))
                  return
            }
            if (formValue.sucursales.length === 0) {
                dispatch(setAlert({
                    message: 'Debe seleccionar al menos una sucursal',
                    type: 'warning'
                  }))
                  return
            }
            if (item) {
              apiClient.patch(`/oferta/${item._id}`, formValue,
              {
                headers: {
                  Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
                }
              })
              .then(r => {
                  eClose()
                  dispatch(setAlert({
                      message: 'Oferta modificada con exito',
                      type: 'success'
                  }))
              })
              .catch(e => console.log("error",e))
            }else{
              apiClient.post(`/oferta`, formValue,
              {
                headers: {
                  Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
                }
              })
              .then(r => {
                  eClose()
                  dispatch(setAlert({
                      message: 'Oferta creada con exito',
                      type: 'success'
                  }))
              })
              .catch(e => dispatch(setAlert({
                message: `${e.response.data.error}`,
                type: 'error'
              })))
            }
        }
    })

    useEffect(() => {
      setLoading(true)
      apiClient.get('/sucursal' ,
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
        .then(r => {
          setData((prevData)=>{
            setLoading(false)
            return r.data.body
          })
        })
        .catch(e => console.log("error",e))
    }, [])

  return (
    <div>
        <Input label={"Fecha Inicio"} type='date' name='fechaInicio' value={formik.values.fechaInicio} onChange={formik.handleChange}  />
        <Input label={"Fecha Final"} type='date' name='fechaFinal' value={formik.values.fechaFinal} onChange={formik.handleChange}  />
        <Input label={"Descuento"} type='number' name='descuento' value={formik.values.descuento} onChange={formik.handleChange} />
        {
          loading ? 
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Loading/>
          </div> 
          :

          <div style={{marginTop: 15}}>
            <InputSearch placeholder={'Buscar sucursal'} width='50%' {...search} />
            <List>
              {
                listSucursales.length === 0 ? 
                <div>
                  No hay sucursales
                </div>
                :
                listSucursales.map((item, index) => (
                  <Title color={process.env.TEXT_COLOR} key={index} 
                    onClick={() => {
                      if (!selectedItems?.includes(item._id)) {
                        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item._id]);
                      } else {
                        setSelectedItems((prevSelectedItems) =>
                          prevSelectedItems.filter((prevSelectedItem) => prevSelectedItem !== item._id)
                        );
                      }
                    }}
                    active={selectedItems?.includes(item._id)}
                  >
                    {item.descripcion}
                  </Title>
                ))
              }
            </List>
          </div>
        }
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 15}}>
            <Button text={'CANCELAR'} onClick={eClose}/>
            <Button text={'ACEPTAR'} onClick={formik.handleSubmit}/>
        </div>
    </div>
  )
}

function initialValues (item) {
    if (item) {
        return {...item, fechaInicio:item.fechaInicio.substring(0, 10), fechaFinal:item.fechaFinal.substring(0, 10),  sucursales: []}
    }
    return {
        fechaInicio: '',
        fechaFinal: '',
        descuento: 0,
        sucursales: [],
        idProducto: ''
    }
} 

const Title = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 5px;
    padding: 15px 0;
    color: ${props=>props.color};
    background-color: ${props=>props.active ? '#d9d9d9' : 'none'};;
    cursor: pointer;
    :hover {
      background-color: #d9d9d9;
    }
`

const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  overflow-y: scroll;
  height: 200px;
`