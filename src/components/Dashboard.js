import React from 'react'
import styled from 'styled-components'
import {BsPersonSquare} from 'react-icons/bs'
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const itemsLi = ["GENERAR VENTA", "VENTAS", "PRODUCTOS", "CLIENTES", "COMPRAS", "GESTION", "CONTABILIDAD"]

export default function Dashboard({children}) {

   const pathname = usePathname()

  return (
    <Container bg={process.env.BLUE_COLOR} >
        <Logo>LOGOTIPO</Logo>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <UserContainer >
                <IconWrapper>
                    <BsPersonSquare/>
                </IconWrapper>
                <div>
                    <User>Zurita Matias</User>
                    <LogOut>Cerrar Sesion</LogOut>
                </div>
            </UserContainer>
        </div>
        <ListaMenu>
            {itemsLi.map((item,index) => (
                <Link href={"/"+(item.toLowerCase().split(' ').join(''))} style={{textDecoration: 'none'}}>
                    <ItemMenu key={index} 
                        isActive={"/"+(item.toLowerCase().split(' ').join('')) === pathname ? true : false}
                        bc={process.env.BLUE_COLOR}
                    >
                        {item}
                    </ItemMenu>
                </Link>
            ))}
        </ListaMenu>
    </Container>
  )
}

const Container = styled.div `
    height: 100vh;
    width: 250px;
    background-color: ${props=>props.bg};
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
`

const Logo = styled.h2 `
  color: #fff;
  text-align: center;
  font-size: 32px;
  margin: 0;
  padding: 15px 0;
`

const UserContainer = styled.div `
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 25px 0;
    padding: 25px 0;
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    width: 80%;
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    color: #FFFFFF;
    padding: 5px;
`

const User = styled.label `
    font-weight: 500;
    font-size: 16px;
    color: #FFFFFF;
`

const LogOut = styled.div `
    font-weight: 600;
    font-size: 12px;
    color: #FFFFFF;
    cursor: pointer;
    :hover {
        color: red;
    }
`

const ListaMenu = styled.ul`
    padding: 0;
    margin: 0;
`

const ItemMenu = styled.li `
    list-style: none;
    font-weight: 600;
    font-size: 16px;
    color: ${props=>props.isActive ? props.bc : '#fff'};
    margin: 15px 0;
    padding: 10px 0;
    padding-inline-start: 30px;
    background-color: ${props=>props.isActive ? '#fff' : props.bc};
    margin-right: 40px;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    cursor: pointer;
    :hover{
        color: ${props=>props.bc};
        background-color: #fff
    }
`