import React from 'react'
import styled from 'styled-components'

export default function NotPermissions() {
  return (
    <div style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}} >
        <Title>No tienes permisos de usuario</Title>
    </div>
  )
}

const Title = styled.h2 `
    font-size: 22px;
    font-weight: 600;
    margin: 5px;
    color: ${process.env.TEXT_COLOR};
    text-align: center;
    @media only screen and (max-width: 600px) {
        font-size: 20px;
    }
`