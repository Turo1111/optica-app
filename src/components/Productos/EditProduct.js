import apiClient from '@/utils/client'
import { useFormik } from 'formik'
import React from 'react'
import Input from '../Input'
import InputSelectAdd from '../InputSelectAdd'
import Button from '../Button'


export default function EditProduct({token, eClose, item}) {
  
    const formik = useFormik({
        initialValues: initialValues(item),
        validateOnChange: false,
        onSubmit: (formValue) => {
          console.log("formvalue editproduct",formValue)
          apiClient.patch(`/producto/${item._id}`, formValue ,
          {
            headers: {
              Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
            }
          }, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(r=>{
            eClose()
            console.log("respuesta editproduct",r)
          })
          .catch(e=>console.log(e))
        }
    })

    const handleClose = () => {
      formik.resetForm({})
      eClose()
    }

    return (
      <div>
          <Input label={"Descripcion"} type='text' name='descripcion' value={formik.values.descripcion} onChange={formik.handleChange} required={true}  />
          <Input label={"Codigo de barra"} type='text' name='codigo' value={formik.values.codigo} onChange={formik.handleChange} />
          <Input label={"Numeracion"} type='text' name='numeracion' value={formik.values.numeracion} onChange={formik.handleChange} />
          <Input label={"Alto"} type='text' name='alto' value={formik.values.alto} onChange={formik.handleChange} />
          <Input label={"Ancho"} type='text' name='ancho' value={formik.values.ancho} onChange={formik.handleChange} />
          <InputSelectAdd label={"Categoria"} type='text' value={formik.values.categoria} onChange={(text)=>formik.setFieldValue('categoria', text)} name='categoria' edit={true} />
          <InputSelectAdd label={"Marca"} type='text' value={formik.values.marca} onChange={(text)=>formik.setFieldValue('marca', text)} name='marca' edit={true}/>
          <InputSelectAdd label={"Color"} type='text' value={formik.values.color} onChange={(text)=>formik.setFieldValue('color', text)} name='color' edit={true}/>
          {formik.values.imagen && <Input label={"Imagen"} type='text' value={formik.values.imagen}/>}
          <Input type='file' name='newimagen'
            onChange={(event) => {
              formik.setFieldValue('newimagen', event.currentTarget.files[0]);
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

function  initialValues (item) {
  if (item) {
    return item
  }
  return {
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
}