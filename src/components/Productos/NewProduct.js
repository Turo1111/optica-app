import React, { useState } from 'react'
import Input from '../Input'
import Button from '../Button'
import InputSelectAdd from '../InputSelectAdd'
import { useFormik } from 'formik'
import apiClient from '@/utils/client'
import useBarcodeGenerator from '@/hooks/useBarcodeGenerator'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch } from '@/redux/hook'
import Loading from '../Loading'
import Confirm from '../Confirm'

export default function NewProduct({token, eClose}) {

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)

  const generateRandomBarcode = () => {
    const randomNumber = Math.floor(Math.random() * 100000);
    const barcodeNumber = randomNumber.toString().padStart(5, '0');
    return barcodeNumber
  };

  const formik = useFormik({
    initialValues: initialValues,
    validateOnChange: false,
    onSubmit: (formValue) => {
      if (formValue.descripcion === '') {
        dispatch(setAlert({
          message: 'Debe ingresar una descripcion al producto',
          type: 'warning'
        }))
        return
      }
      if (formValue.idProveedor === '') {
        dispatch(setAlert({
          message: 'Debe ingresar un proveedor al producto',
          type: 'warning'
        }))
        return
      }
      if (formValue.precioGeneral === '' || formValue.precioGeneral <= 0) {
        dispatch(setAlert({
          message: 'Debe ingresar un precio general al producto',
          type: 'warning'
        }))
        return
      }
      if (formValue.idCategoria === '') {
        dispatch(setAlert({
          message: 'Debe ingresar una categoria al producto',
          type: 'warning'
        }))
        return
      }
      if (formValue.codigo === '') {
        dispatch(setAlert({
          message: 'Debe ingresar un codigo al producto',
          type: 'warning'
        }))
        return
      }
      setLoading(true)
       apiClient.post('/producto', formValue,
       {
         headers: {
           Authorization: `Bearer ${token}`, // Agregar el token en el encabezado como "Bearer {token}"
           'Content-Type': 'multipart/form-data'
         }
       })
      .then(r=>{
        formik.resetForm(initialValues)
        eClose()
        dispatch(setAlert({
          message: 'Producto creado correctamente',
          type: 'success'
        }))
        setLoading(false)
      })
      .catch(e=>{
        setLoading(false)
        dispatch(setAlert({
          message: `${e.response.data.error || 'Ocurrio un error'}`,
          type: 'error'
        }))
      }) 
    }
  })

  const handleClose = () => {
    formik.resetForm(initialValues)
    eClose()
  }

  return (
    <div>
        <Input label={"Descripcion"} type='text' name='descripcion' value={formik.values.descripcion} onChange={formik.handleChange} required={true}  />
        <div style={{display: 'flex', alignItems: 'center'}} >
          <Input label={"Codigo de barra"} type='text' name='codigo' value={formik.values.codigo} onChange={formik.handleChange} />
          <Button text={'GENERAR'} onClick={()=>{
            const randomCode = generateRandomBarcode()
            formik.setFieldValue('codigo', randomCode)
          }} />
        </div>
        <Input label={"Numeracion"} type='text' name='numeracion' value={formik.values.numeracion} onChange={formik.handleChange} />
        <Input label={"Alto"} type='text' name='alto' value={formik.values.alto} onChange={formik.handleChange} />
        <Input label={"Ancho"} type='text' name='ancho' value={formik.values.ancho} onChange={formik.handleChange} />
        <InputSelectAdd label={"Categoria"} type='text' value={formik.values.idCategoria} onChange={(id, item)=>{
          formik.setFieldValue('idCategoria', id)
          formik.setFieldValue('categoria', item.descripcion)
        }} name='categoria' />
         <InputSelectAdd label={"Proveedor"} type='text' value={formik.values.idProveedor} onChange={(id, item)=>{
          formik.setFieldValue('idProveedor', id)
          formik.setFieldValue('proveedor', item.descripcion)
        }} name='proveedor' />
        <InputSelectAdd label={"Marca"} type='text' value={formik.values.idMarca} onChange={(id, item)=>{
          formik.setFieldValue('idMarca', id)
          formik.setFieldValue('marca', item.descripcion)
        }} name='marca'/>
        <InputSelectAdd label={"Color"} type='text' value={formik.values.idColor} onChange={(id, item)=>{
          formik.setFieldValue('idColor', id)
          formik.setFieldValue('color', item.descripcion)
        }} name='color'/>
        <Input type='file' name='imagen'
          onChange={(event) => {
            formik.setFieldValue('imagen', event.currentTarget.files[0]);
          }}
        /> 
        <Input label={"Precio general"} name='precioGeneral' type='number' value={formik.values.precioGeneral} onChange={formik.handleChange} prefix={'$'} />
        <Input label={"Precio Compra"} name='precioCompra' type='number' value={formik.values.precioCompra} onChange={formik.handleChange} prefix={'$'} />
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
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
    </div>
  )
  
}

const initialValues = {
    descripcion: '',
    codigo: '',
    numeracion: '',
    ancho: '',
    alto: '',
    idCategoria: '',
    idProveedor: '',
    proveedor: '',
    idMarca: '',
    idColor: '',
    categoria: '',
    marca: '',
    color: '',
    imagen: null,
    precioGeneral: 0,
    precioCompra: 0
  
}