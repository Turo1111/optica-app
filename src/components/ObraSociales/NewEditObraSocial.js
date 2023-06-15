import React, { useEffect, useState } from 'react'
import ToggleSwitch from '../ToggleSwitch'
import { useFormik } from 'formik'
import Input from '../Input'
import Button from '../Button'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch } from '@/redux/hook'
import apiClient from '@/utils/client'
import EmptyList from '../EmptyList'
import ItemProducto from '../ItemProducto'
import InputSearch from '../InputSearch'
import Loading from '../Loading'
import styled from 'styled-components'

export default function NewEditObraSocial({item , edit, handleClose}) {

    const dispatch = useAppDispatch();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState(item.productosDescuento);


    const formik = useFormik({
        initialValues: initialValues(item),
        validateOnChange: false,
        onSubmit: (formValue) => {
          formValue.productosDescuento = selectedItems;
          console.log(formValue)
          if (item) {
            apiClient.patch(`/obrasocial/${item._id}`, formValue)
            .then(r=>{
              handleClose()
              dispatch(setAlert({
                message: 'Obra Social modificada correctamente',
                type: 'success'
              }))
            })
            .catch(e=>dispatch(setAlert({
              message: 'Hubo un error inesperado, revisa los datos',
              type: 'error'
            })))
          }else{
            apiClient.post(`/obrasocial`, formValue)
            .then(r=>{
              handleClose()
              dispatch(setAlert({
                message: 'Obra Social creada correctamente',
                type: 'success'
              }))
            })
            .catch(e=>dispatch(setAlert({
              message: 'Hubo un error inesperado, revisa los datos',
              type: 'error'
            })))
          }
        }
    })

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

  return (
    <div>
        <Input label={"Descripcion"} type='text' name='descripcion' value={formik.values.descripcion} onChange={formik.handleChange} required={true}  />
        <Input label={"Descuento"} type='number' name='cantidadDescuento' value={formik.values.cantidadDescuento} onChange={formik.handleChange}/>
        <Input label={"Devolucion"} type='number' name='cantidadDevuelta' value={formik.values.cantidadDevuelta} onChange={formik.handleChange}/>
        <ToggleSwitch checked={formik.values.tipoDescuento} onChange={(newValue)=>formik.setFieldValue('tipoDescuento', newValue)} label={formik.values.tipoDescuento ? 'Efectivo' : 'Porcentaje'}/>
        {
          loading ? 
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Loading/>
          </div> 
          :
          <div style={{marginTop: 15}}>
            <InputSearch placeholder={'Buscar Productos'} width='50%' />
            <ul style={{ flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0 }}>
              {
                data.map((item, index) => (
                  <Title color={process.env.TEXT_COLOR} key={index} 
                    onClick={() => {
                      if (!selectedItems.includes(item._id)) {
                        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item._id]);
                      } else {
                        setSelectedItems((prevSelectedItems) =>
                          prevSelectedItems.filter((prevSelectedItem) => prevSelectedItem !== item._id)
                        );
                      }
                    }}
                    active={selectedItems.includes(item._id)}
                  >
                    {item.descripcion}
                  </Title>
                ))
              }
            </ul>
          </div>
        }
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 15}}>
            <Button text={'CANCELAR'} onClick={handleClose}/>
            <Button text={'ACEPTAR'} onClick={formik.handleSubmit}/>
        </div>
    </div>
  )
}

function initialValues (item) {
    if (item) {
        return {...item, productosDescuento: []}
    }
    return {
        descripcion: '',
        cantidadDescuento: '',
        cantidadDevuelta: '',
        tipoDescuento: true,
        productosDescuento: []
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