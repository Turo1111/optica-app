import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import Input from '../Input'
import InputSelect from '../InputSelect'
import Button from '../Button'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch } from '@/redux/hook'

export default function AddCard({
    total, setDataCard, onClose,
    pago, dineroIngresado, onChangeDineroIngresado,
    cuota
}) {

    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            banco: 'Ninguno',
            cuotas: 1
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
            if (formValue.banco  === '') {
                dispatch(setAlert({
                  message: 'Debe ingresar un nombre al banco',
                  type: 'warning'
                }))
                return
            }
            if (pago.descripcion === 'EFECTIVO Y TARJETA' || pago.descripcion === 'CUENTA CORRIENTE') {
                if (dineroIngresado  <= 0 || dineroIngresado  === '') {
                    dispatch(setAlert({
                      message: 'Dinero ingresado tiene que ser mayor a 0',
                      type: 'warning'
                    }))
                    return
                }
            }
            if(total !== 0) {
                onClose()
                return setDataCard(formValue)
            }
            dispatch(setAlert({
                message: 'Hubo un error inesperado, revisa los datos',
                type: 'error'
            }))
        }
    })

  return (
    <Container>
        {
          (pago.descripcion === 'EFECTIVO Y TARJETA' || pago.descripcion === 'CUENTA CORRIENTE') && <Input label={"Dinero ingresado"} type='number' name='dineroIngresado' value={dineroIngresado} onChange={onChangeDineroIngresado} prefix={'$'}/>
        }
        {
            pago.descripcion !== 'CUENTA CORRIENTE' && <Input label={"Banco"} type='text' name='banco' value={formik.values.banco} onChange={formik.handleChange} required={true}  />
        }
        <InputSelect label={'Cuotas'} name={'cuotas'} value={''} preData={cuota} onChange={(id, item)=>formik.setFieldValue('cuotas', item.cantidad)} condicion={ pago.descripcion === 'EFECTIVO Y TARJETA' ? dineroIngresado > 0 : true} e='Dinero ingresado tiene que ser mayor a 0'/>
        <div style={{display: 'flex', justifyContent: 'end', marginTop: 15}}>
            <Button text={'ACEPTAR'} onClick={formik.handleSubmit}/>
        </div>
    </Container>
  )
}


const Container = styled.div `
    padding: 5px;
`
