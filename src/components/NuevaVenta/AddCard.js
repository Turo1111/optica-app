import { useFormik } from 'formik'
import React from 'react'
import styled from 'styled-components'
import Input from '../Input'
import InputSelect from '../InputSelect'
import Button from '../Button'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch } from '@/redux/hook'

export default function AddCard({total, setDataCard, onClose}) {

    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            banco: '',
            cuotas: 1
        },
        validateOnChange: false,
        onSubmit: (formValue) => {
            console.log(formValue)
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
        <Input label={"Banco"} type='text' name='banco' value={formik.values.banco} onChange={formik.handleChange} required={true}  />
        <InputSelect label={'Cuotas'} name={'cuotas'} value={''} preData={cuotas(total)} onChange={(id, item)=>formik.setFieldValue('cuotas', item.cantidad)}/>

        <div style={{display: 'flex', justifyContent: 'end', marginTop: 15}}>
            <Button text={'ACEPTAR'} onClick={formik.handleSubmit}/>
        </div>
    </Container>
  )
}

function cuotas (total) {
    return [
        {
            cantidad: 1,
            descripcion:`1 x ${(total/1).toFixed(2)}`
        },
        {
            cantidad: 3,
            descripcion:`3 x ${(total/3).toFixed(2)}`
        },
        {
            cantidad: 6,
            descripcion:`6 x ${(total/6).toFixed(2)}`
        },
        {
            cantidad: 12,
            descripcion:`12 x ${(total/12).toFixed(2)}`
        }
    ]
}

const Container = styled.div `
    padding: 5px;
`
