import React, { useEffect } from 'react'
import Modal from './Modal'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector, useRedux } from '@/redux/hook';
import { clearAlert, getAlert } from '@/redux/alertSlice';

export default function Alerta() {

    const alert = useAppSelector(getAlert);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (alert.open) {
          const timeout = setTimeout(() => {
            dispatch(clearAlert());
          }, 3000); // Tiempo en milisegundos antes de ejecutar clearAlert
          
          return () => clearTimeout(timeout);
        }
    }, [alert.open, dispatch]);

  return (
        <Container background={alert.color} open={alert.open} >
            {alert.message}
        </Container>
    )
}

const Container = styled.div `
    display: ${props=> props.open ? 'block' : 'none' };
    z-index: 100;
    padding: 15px 50px;
    background-color: ${props=>props.background ? props.background : '#F7A4A4' };
    position: fixed;
    margin-top: 25px;
    border-radius: 15px;
    color: #F9F5F6;
    font-weight: 600;
    left: 50%;
    transform: translateX(-50%);
`
