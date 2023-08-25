import React from 'react'
import styled from 'styled-components'
import InputSelect from '../InputSelect'
import TextArea from '../TextArea'
import Button from '../Button'
import Input from '../Input'
const preData = [{_id: 1, descripcion: 'EFECTIVO'}, {_id: 2, descripcion: 'TARJETA'}, {_id: 3, descripcion: 'EFECTIVO Y TARJETA'}, {_id: 4, descripcion: 'CUENTA CORRIENTE'}]

export default function DataSale({
    pago,
    onChangeTipoPago,
    dataCard,
    onChangeObraSocial,
    observacion,
    onChangeObservacion,
    descuento,
    total,
    subTotal,
    finishSale,
    dineroIngresado,
    onChangeDineroIngresado
}) {
  return (
    <ContainerInfo>
      <ContainerInput>
        <InputSelect label={'Tipo de pago'} name={'tipoPago'} value={pago.descripcion} preData={preData} onChange={onChangeTipoPago} condicion={total>0} e='Eliga productos antes de seleccionar metodo de pago' />
        {
          dataCard && 
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            {dineroIngresado > 0 &&  <Tag color={process.env.TEXT_COLOR} style={{margin: 0}}> Dinero ingresado : {dineroIngresado || ''}</Tag>}
            <Tag color={process.env.TEXT_COLOR} style={{margin: 0}}> Banco : {dataCard?.banco || ''}</Tag>
            <Tag color={process.env.TEXT_COLOR} style={{margin: 0}} > Cuotas : {dataCard?.cuotas+`x${ dineroIngresado > 0 ? ((total-dineroIngresado)/dataCard?.cuotas).toFixed(2):(total/dataCard?.cuotas).toFixed(2)}` || ''}</Tag>
          </div>
        }
        {
          pago.descripcion === 'EFECTIVO' && <Input label={"Dinero ingresado"} type='number' name='dineroIngresado' value={dineroIngresado} onChange={onChangeDineroIngresado} prefix={'$'}/>
        }
        <InputSelect label={'Obra social'} name={'obrasocial'} value={''} emptyOption={[{_id: '', descripcion: 'Sin obra social'}]} onChange={onChangeObraSocial} condicion={total>0} e='Eliga productos antes de seleccionar obra social'/>
      </ContainerInput>
      <div style={{flex: 1, marginTop: 15, display: 'flex', flexDirection: 'column' }}>
        <TextArea label={"Observacion"} name='observacion' value={observacion} onChange={onChangeObservacion} />
        <div style={{display: 'flex', alignItems: 'end', flexDirection: 'column'}} >
          <div style={{textAlign: 'end'}} >
            <Tag color={process.env.TEXT_COLOR} > Descuento : $ {descuento} </Tag>   
            <Tag color={process.env.TEXT_COLOR}> Sub-Total : $ {subTotal} </Tag>
            <Tag color={process.env.TEXT_COLOR} > Total : $ {total} </Tag>
          </div>
          <div style={{display: 'flex', flex: 1, justifyContent: 'end', alignItems: 'end'}} >
            <Button text={'CONTINUAR'} onClick={finishSale} />
          </div>
        </div>
      </div>
    </ContainerInfo>
  )
}


const ContainerInfo = styled.div `
  background-color: #fff;
  border-radius: 15px;
  padding: 0 15px; 
  flex: 1; 
  margin: 15px 0;
  overflow-y: scroll;
  flex: 1;
  display: flex;
  @media only screen and (max-width: 800px) {
      flex-direction: column
  }
`
const ContainerInput = styled.div `
  flex: 1;
  margin-right: 15px;
  @media only screen and (max-width: 800px) {
    margin-right: 0
  }
`
const Tag = styled.h2 `
    font-size: 16px;
    font-weight: 500;
    color: ${props=>props.color};
    @media only screen and (max-width: 1440px) {
        font-size: 14px;
    }
`