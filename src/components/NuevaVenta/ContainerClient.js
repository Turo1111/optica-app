import React from 'react'
import InputSearch from '../InputSearch'
import Button from '../Button'
import ToggleSwitch from '../ToggleSwitch'
import styled from 'styled-components'
import Input from '../Input'

export default function SelectClient({dineroIngresado, onChangeDineroIngresado, clientSelected, searchClient, listCliente, onSelectClient, openNewClient, consumidorFinal, onChangeConsumidorFinal, onChangeUseSenia, useSenia}) {
  return (
    <div style={{display: 'flex', flex: 1, flexDirection: 'column'}} >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <InputSearch placeholder={'Buscar Cliente'} {...searchClient} width='95%' data={listCliente} modal={true} prop={'nombreCompleto'} onSelect={onSelectClient}  
          />
          <Button text={'NUEVO'} onClick={openNewClient} />
        </div>
        <div style={{backgroundColor: '#fff', borderRadius: 15, padding: 15, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{margin: '15px 0'}}>
            <ToggleSwitch checked={consumidorFinal} onChange={onChangeConsumidorFinal} label={'Consumidor final'}/>
          </div>
            <Title color={process.env.TEXT_COLOR}>Nombre Completo : {clientSelected?.nombreCompleto || ''}</Title>
            <Tag color={process.env.TEXT_COLOR}> Telefono : {clientSelected?.telefono || '-'}</Tag>
            <Tag color={process.env.TEXT_COLOR}> DNI : {clientSelected?.dni || '-'}</Tag>
            {
              clientSelected?.senia &&
              <Tag color={process.env.TEXT_COLOR} style={{fontSize: 14}} > Observacion : {clientSelected?.senia?.observacion || '-'}</Tag>
            }
            <ToggleSwitch checked={useSenia} onChange={onChangeUseSenia} label={'Utilizar seña en venta '}
            />
            {
              useSenia && <Input label={"Seña"} type='number' name='dineroIngresado' value={dineroIngresado} onChange={onChangeDineroIngresado} prefix={'$'}/>
            }
        </div>
    </div>
  )
}

const Title = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 10px 0;
    color: ${props=>props.color};
    @media only screen and (max-width: 1440px) {
        font-size: 16px;
    }
    @media only screen and (max-width: 650px) {
        font-size: 14px;
    }
`

const Tag = styled.h2 `
    font-size: 16px;
    font-weight: 500;
    margin: 10px 0;
    color: ${props=>props.color};
    @media only screen and (max-width: 1440px) {
        font-size: 14px;
    }
`