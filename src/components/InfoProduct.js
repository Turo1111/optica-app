import React from 'react'
import styled from 'styled-components'

export default function InfoProduct() {
  return (
    <div>
        <Descripcion color={process.env.TEXT_COLOR}>Lentes de Contacto Acuvue OASYS con Hydraclear Plus</Descripcion>
        <div style={{display: 'flex'}} >
            <div>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Categoria :</label> Lentes
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Codigo :</label> #1156516da51d66da
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Numeracion :</label> dabjkdasbdbka
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Alto :</label> 300 mm
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Ancho :</label> 200 mm
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Marca :</label> Rayban
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Color :</label> Azul
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Precio general :</label> $15600
                </Caracteristicas>  
            </div>
            <div>

            </div>
        </div>
        <div>
            <div style={{display: 'flex', justifyContent: 'space-around'}} >
                <Caracteristicas color={process.env.TEXT_COLOR} style={{fontSize: 16, fontWeight: 'bold'}}>Sucursal</Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR} style={{fontSize: 16, fontWeight: 'bold'}}>Stock</Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR} style={{fontSize: 16, fontWeight: 'bold'}}>Precio Efectivo</Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR} style={{fontSize: 16, fontWeight: 'bold'}}>Precio Lista</Caracteristicas>
            </div>
        </div>
    </div>
  )
}

const Descripcion = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 15px 5px;
    color: ${props=>props.color};
`
const Caracteristicas = styled.h6 `
    font-size: 14px;
    font-weight: 400;
    margin: 15px 5px;
    color: ${props=>props.color};
`
