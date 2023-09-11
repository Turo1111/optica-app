import React from 'react'
import Modal from './Modal'
import Loading from './Loading'
import Button from './Button'
import styled from 'styled-components'

export default function Confirm({open, handleClose, loading, confirmAction}) {
  return (
    <Modal
      open={open}
      title={'CONFIRMACION'}
      height='auto'
      width='100px'
      eClose={handleClose}
    >
        <Caracteristicas>¿Estas seguro de realizar la accion?</Caracteristicas>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          {
            loading ? 
            <Loading />:
            <>
              <Button text={'CANCELAR'} onClick={handleClose}/>
              <Button text={'ACEPTAR'} onClick={()=>{
                handleClose()
                confirmAction()
              }}/>
            </>
          }
        </div>
    </Modal>
  )
}

const Caracteristicas = styled.h6 `
    font-size: 18px;
    font-weight: 400;
    margin: 15px 0;
    color: ${process.env.TEXT_COLOR};
`
