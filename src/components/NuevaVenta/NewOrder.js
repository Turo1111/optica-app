import { useFormik } from 'formik'
import React from 'react'
import styled from 'styled-components'
import Input from '../Input'
import Button from '../Button'
import { useAppDispatch } from '@/redux/hook'

export default function NewOrder({onClose, setDateCard}) {

    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            fecha: '',
            numero: 1
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
          setDateCard(formValue)
          onClose()
        }
    })

  return (
    <Container>
        <Input label={"Fecha"} type='date' name='fecha' value={formik.values.fecha} onChange={formik.handleChange}  />
        <Input label={'Numero de orden'} name={'numero'} value={formik.values.numero} onChange={formik.handleChange}/>
        <div style={{display: 'flex', justifyContent: 'end', marginTop: 15}}>
            <Button text={'ACEPTAR'} onClick={formik.handleSubmit}/>
        </div>
    </Container>
  )
}

const Container = styled.div `
    padding: 5px;
`
