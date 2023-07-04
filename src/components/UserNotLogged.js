import React, { useEffect } from 'react'
import Loading from './Loading'
import styled from 'styled-components'
import { useRouter } from 'next/navigation';

export default function UserNotLogged() {

  const router = typeof window !== 'undefined' ? useRouter() : null;

  useEffect(() => {
    const redirect = async () => {
      await delay(5000); // Esperar 5 segundos
      
      router.push('/');
    };

    redirect();
  }, [router]);

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

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