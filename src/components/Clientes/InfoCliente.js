import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Table from '../Table'
import apiClient from '@/utils/client'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'

export default function InfoCliente({_id, nombreCompleto, telefono, dni, cuentaCorriente, token}) {
    const [senia, setSenia] = useState([])
    const dispatch = useAppDispatch();

    useEffect(()=>{
        apiClient.get(`/senia/${_id}` ,
        {
          headers: {
            Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
          .then(r=>{
            setSenia(r.data.body)
          })
          .catch(e=>{
            console.log(e);
            dispatch(setAlert({
            message: `${e.response.data.error}`,
            type: 'error'
          }))})
    },[])

  return (
    <div style={{ padding: 5}}>
        <Title color={process.env.TEXT_COLOR}>Nombre Completo : {nombreCompleto  || "No definido"}</Title>
        <Tag color={process.env.TEXT_COLOR}> Telefono : {telefono || "No definido"}</Tag>
        <Tag color={process.env.TEXT_COLOR}> DNI : {dni || "No definido"}</Tag>
        <Tag color={process.env.TEXT_COLOR}> Seña activa : </Tag>
        <Tag color={process.env.TEXT_COLOR}> Cuenta corriente : {cuentaCorriente || "0"}</Tag>
        {
            !senia ? <Title color={process.env.TEXT_COLOR} style={{margin: '15px 0'}}>NO TIENE SENIA ACTIVA</Title> :
            <Table data={senia} columns={columnsSenia} onClick={(item)=>console.log("")} 
            />
        }
    </div>
  )
}

const columnsSenia = [
    { label: 'Fecha', field: 'fecha', width: '25%', date: true },
    { label: 'Saldo', field: 'saldo', width: '25%', align: 'center' },
    { label: 'Estado', field: 'estado', width: '25%', align: 'center' },
    { label: 'Observacion', field: 'observacion', width: '25%', align: 'center' },
];


const Title = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 5px 0;
    color: ${props=>props.color};
    @media only screen and (max-width: 445px) {
        font-size: 14px;
    }
`

const Tag = styled.h2 `
    font-size: 16px;
    font-weight: 500;
    color: ${props=>props.color};
    @media only screen and (max-width: 445px) {
        font-size: 14px;
    }
`
