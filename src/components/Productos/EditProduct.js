import apiClient from '@/utils/client'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import Input from '../Input'
import InputSelectAdd from '../InputSelectAdd'
import Button from '../Button'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch } from '@/redux/hook'
import Loading from '../Loading'
import Confirm from '../Confirm'


export default function EditProduct({token, eClose, item}) {

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  
    const formik = useFormik({
        initialValues: initialValues(item),
        validateOnChange: false,
        onSubmit: (formValue) => {
          if (item._id === '64f0c9e9ae80e2477accbc14' || item._id === '64f0ca05ae80e2477accbc24') {
            dispatch(setAlert({
              message: 'No se puede modificar este producto',
              type: 'error'
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
          if (formValue.descripcion === '') {
            dispatch(setAlert({
              message: 'Debe ingresar una descripcion al producto',
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
          apiClient.patch(`/producto/${item._id}`, formValue ,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Agregar el token en el encabezado como "Bearer {token}"
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(r=>{
            eClose()
            dispatch(setAlert({
              message: 'Producto editado correctamente',
              type: 'success'
            }))
            setLoading(false)
          })
          .catch(e=>{
            setLoading(false)
            dispatch(setAlert({
            message: `${e.response.data.error || 'Ocurrio un error'}`,
            type: 'error'
          }))})
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
          <InputSelectAdd label={"Categoria"} type='text' value={formik.values.categoria} onChange={(id, item)=>{
            formik.setFieldValue('idCategoria', id)
            formik.setFieldValue('categoria', item.descripcion)
          }}  name='categoria' edit={true} />
          <InputSelectAdd label={"Proveedor"} type='text' value={formik.values.idProveedor} onChange={(id, item)=>{
          formik.setFieldValue('idProveedor', id)
          formik.setFieldValue('proveedor', item.descripcion)
        }} name='proveedor' />
          <InputSelectAdd label={"Marca"} type='text' value={formik.values.marca} onChange={(id, item)=>{
            formik.setFieldValue('idMarca', id)
            formik.setFieldValue('marca', item.descripcion)
          }} name='marca' edit={true}/>
          <InputSelectAdd label={"Color"} type='text' value={formik.values.color} onChange={(id, item)=>{
            formik.setFieldValue('idColor', id)
            formik.setFieldValue('color', item.descripcion)
          }} name='color' edit={true}/>
          {formik.values.imagen && <Input label={"Imagen"} type='text' value={formik.values.imagen}/>}
          <Input type='file' name='newimagen'
            onChange={(event) => {
              formik.setFieldValue('newimagen', event.currentTarget.files[0]);
            }}
          />
          <Input label={"Precio general"} name='precioGeneral' type='text' value={formik.values.precioGeneral} onChange={formik.handleChange} prefix={'$'} />
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

function  initialValues (item) {
  if (item) {
    return {...item, newimagen: ''}
  }
  return {
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
    precioGeneral: 0
  
}
}