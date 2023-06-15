import React from 'react'
import Loading from './Loading'
import styled from 'styled-components'
import { useRouter } from 'next/navigation';

export default function UserNotLogged() {

    const router = useRouter();

    setTimeout(() => {
        router.push('/')
    }, 5000);

  return (
    <div style={{textAlign: 'center', margin: 25}}>
        <Title color={process.env.TEXT_COLOR}>EL USUARIO NO ESTA LOGEADO</Title>
        <Loading text='REDIRECCIONANDO....' />
    </div>
  )
}

const Title = styled.h2 `
    font-size: 26px;
    font-weight: 600;
    margin: 5px;
    color: ${props=>props.color};
    text-align: center,

`