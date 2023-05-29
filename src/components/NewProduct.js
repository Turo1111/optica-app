import React from 'react'
import Input from './Input'
import Button from './Button'
import InputSelectAdd from './InputSelectAdd'
const itemsLi = ["GENERAR VENTA", "VENTAS", "PRODUCTOS", "CLIENTES", "COMPRAS", "GESTION", "CONTABILIDAD"]

export default function NewProduct({eClose}) {
  return (
    <div>
        <Input label={"Descripcion"} type='text' />
        <Input label={"Codigo"} type='text' />
        <Input label={"Numeracion"} type='text' />
        <Input label={"Alto"} type='text' />
        <Input label={"Ancho"} type='text' />
        <InputSelectAdd label={"Categoria"} type='text' data={itemsLi}/>
        <InputSelectAdd label={"SubCategoria"} type='text' data={itemsLi}/>
        <InputSelectAdd label={"Marca"} type='text' data={itemsLi}/>
        <InputSelectAdd label={"Color"} type='text' data={itemsLi}/>
        <Input type='file' />
        <Input label={"Precio general"} type='text' />
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <Button text={'CANCELAR'} onClick={eClose}/>
            <Button text={'ACEPTAR'} onClick={eClose}/>
        </div>
    </div>
  )
}
