'use client'
import Dashboard from '@/components/Dashboard'
import Empleados from '@/components/Empleados/Empleados'
import Modal from '@/components/Modal'
import NotPermissions from '@/components/NotPermissions'
import ObraSocial from '@/components/ObraSociales/ObraSocial'
import CierreCajaModal from '@/components/Registros/CierreCajaModal'
import Registros from '@/components/Registros/Registros'
import RetiroDineroModal from '@/components/Registros/RetiroDineroModal'
import Roles from '@/components/Roles/Roles'
import Sucursales from '@/components/Sucursales/Sucursales'
import { useAppSelector } from '@/redux/hook'
import { getUser } from '@/redux/userSlice'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MdArrowForwardIos } from 'react-icons/md'
import styled from 'styled-components'

export default function Gestion() {

    const [openSucursal, setOpenSucursal] = useState(false)
    const [openObraSocial, setOpenObraSocial] = useState(false)
    const [openUsuarios, setOpenUsuarios] = useState(false)
    const [openRoles, setOpenRoles] = useState(false)
    const user = useAppSelector(getUser);
    const [permission, setPermission] = useState(false)
    const [openReg, setOpenReg] = useState(false)
    const [openCierreCaja, setOpenCierreCaja] = useState(false)
    const [openRetiroDinero, setOpenRetiroDinero] = useState(false)

    useEffect(()=>{
        if (user.usuario !== '') {
            user.roles.permisos.forEach((permiso) => {
                if (permiso.screen.toLowerCase() === 'gestion') {
                  if (!permiso.lectura) {
                    return setPermission(false)
                  }
                  return setPermission(true)
                }
            });
        }
    },[user])

    if (!permission) {
        return <NotPermissions/>
    }

  return (
    <>
        <Lista>
          <ItemLista color={process.env.TEXT_COLOR} onClick={()=>setOpenSucursal(true)} >
              SUCURSALES
              <IconWrapper color={process.env.TEXT_COLOR}>
                  <MdArrowForwardIos/>
              </IconWrapper>
          </ItemLista>
          <ItemLista color={process.env.TEXT_COLOR} onClick={()=>setOpenObraSocial(true)} >
              OBRAS SOCIALES
              <IconWrapper color={process.env.TEXT_COLOR}>
                  <MdArrowForwardIos/>
              </IconWrapper>
          </ItemLista>
          <ItemLista color={process.env.TEXT_COLOR} onClick={()=>setOpenUsuarios(true)} >
              EMPLEADOS
              <IconWrapper color={process.env.TEXT_COLOR}>
                  <MdArrowForwardIos/>
              </IconWrapper>
          </ItemLista>
          <ItemLista color={process.env.TEXT_COLOR} onClick={()=>setOpenRoles(true)} >
              ROLES
              <IconWrapper color={process.env.TEXT_COLOR}>
                  <MdArrowForwardIos/>
              </IconWrapper>
          </ItemLista>
          <ItemLista color={process.env.TEXT_COLOR} onClick={()=>setOpenReg(true)} >
              REGISTROS
              <IconWrapper color={process.env.TEXT_COLOR}>
                  <MdArrowForwardIos/>
              </IconWrapper>
          </ItemLista>
          <ItemLista color={process.env.TEXT_COLOR} onClick={()=>setOpenCierreCaja(true)} >
              CIERRES DE CAJA
              <IconWrapper color={process.env.TEXT_COLOR}>
                  <MdArrowForwardIos/>
              </IconWrapper>
          </ItemLista>
          <ItemLista color={process.env.TEXT_COLOR} onClick={()=>setOpenRetiroDinero(true)} >
              RETIROS DE DINERO
              <IconWrapper color={process.env.TEXT_COLOR}>
                  <MdArrowForwardIos/>
              </IconWrapper>
          </ItemLista>
        </Lista>
        {
            openSucursal &&
            <Modal eClose={()=>setOpenSucursal(false)} open={openSucursal} title={'SUCURSALES'} height='90%' width='40%' >
                <Sucursales/>
            </Modal>
        }
        {
            openObraSocial && 
            <Modal eClose={()=>setOpenObraSocial(false)} open={openObraSocial} title={'OBRA SOCIALES'} height='90%' width='40%' >
                <ObraSocial/>
            </Modal>
        }
        {
            openRoles &&
            <Modal eClose={()=>setOpenRoles(false)} open={openRoles} title={'ROLES'} height='90%' width='40%' >
                <Roles/>
            </Modal>
        }
        {
            openUsuarios &&
            <Modal eClose={()=>setOpenUsuarios(false)} open={openUsuarios} title={'EMPLEADOS'} height='90%' width='40%' >
                <Empleados/>
            </Modal>
        }
        {
            openReg && 
            <Modal eClose={()=>setOpenReg(false)} open={openReg} title={'REGISTROS'} height='90%' width='40%' >
                <Registros/>
            </Modal>
        }
        {
            openCierreCaja && 
            <Modal eClose={()=>setOpenCierreCaja(false)} open={openCierreCaja} title={'CIERRES DE CAJA'} height='90%' width='60%' >
                <CierreCajaModal/>
            </Modal>
        }
        {
            openRetiroDinero && 
            <Modal eClose={()=>setOpenRetiroDinero(false)} open={openRetiroDinero} title={'RETIROS DE DINERO'} height='90%' width='60%' >
                <RetiroDineroModal/>
            </Modal>
        }
    </>
  )
}

const Lista = styled.ul `
    flex: 1; 
    background-color: '#fff'; 
    border-radius: 15; 
    padding: 0 ;
    overflow-y: scroll;
`

const ItemLista = styled.li `
    list-style: none;
    color: ${props=>props.color};
    font-size: 32px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    padding: 25px;
    margin: 5px 75px;
    border-bottom: 1px solid #d9d9d9;
    cursor: pointer;
    :hover{
        background-color: #F9F5F6;
    };
    @media only screen and (max-width: 445px) {
        margin: 5px 25px;
        font-size: 26px;
    }
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: ${props=>props.color};
    padding: 5px;
`