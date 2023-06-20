import React from 'react'
import Input from '../Input'
import Button from '../Button'
import InputSelectAdd from '../InputSelectAdd'
import { useFormik } from 'formik'
import apiClient from '@/utils/client'
import useBarcodeGenerator from '@/hooks/useBarcodeGenerator'

export default function NewProduct({token, eClose}) {

  const generateRandomBarcode = () => {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    const barcodeNumber = randomNumber.toString().padStart(9, '0');
    return barcodeNumber
  };

  const formik = useFormik({
    initialValues: initialValues,
    validateOnChange: false,
    onSubmit: (formValue) => {
      console.log(formValue)
       apiClient.post('/producto',
       {
         headers: {
           Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
         }
       }, formValue, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(r=>{
        formik.resetForm(initialValues)
        eClose()
        console.log(r)
      })
      .catch(e=>console.log(e)) 
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
        <InputSelectAdd label={"Categoria"} type='text' value={formik.values.categoria} onChange={(text)=>formik.setFieldValue('categoria', text)} name='categoria' />
        <InputSelectAdd label={"Marca"} type='text' value={formik.values.marca} onChange={(text)=>formik.setFieldValue('marca', text)} name='marca'/>
        <InputSelectAdd label={"Color"} type='text' value={formik.values.color} onChange={(text)=>formik.setFieldValue('color', text)} name='color'/>
        <Input type='file' name='imagen'
          onChange={(event) => {
            formik.setFieldValue('imagen', event.currentTarget.files[0]);
          }}
        /> 
        <Input label={"Precio general"} name='precioGeneral' type='text' value={formik.values.precioGeneral} onChange={formik.handleChange} />
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <Button text={'CANCELAR'} onClick={handleClose}/>
            <Button text={'ACEPTAR'} onClick={formik.handleSubmit}/>
        </div>
    </div>
  )
  
}

const initialValues = {
    descripcion: '',
    codigo: '',
    numeracion: '',
    ancho: '',
    alto: '',
    categoria: '',
    marca: '',
    color: '',
    imagen: null,
    precioGeneral: ''
  
}