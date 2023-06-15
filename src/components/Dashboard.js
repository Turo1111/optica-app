import React from 'react'
import styled from 'styled-components'
import {BsPersonSquare} from 'react-icons/bs'
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { clearUser, getUser, setUser } from '@/redux/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setAlert } from '@/redux/alertSlice';
import UserNotLogged from './UserNotLogged';
import useLocalStorage from '@/hooks/useLocalStorage';

/* const itemsLi = ["GENERAR VENTA", "VENTA", "PRODUCTO", "CLIENTE", "COMPRA", "GESTION", "CONTABILIDAD"] */
const itemsLi = ["PRODUCTOS","GESTION", "CLIENTES"]

export default function Dashboard({children}) {

   const pathname = usePathname()
   const user = useAppSelector(getUser);
   const dispatch = useAppDispatch();
   const router = useRouter()
   const [valueStorage , setValue, clearValue] = useLocalStorage("user", "")

    if (valueStorage.token) {
        dispatch(setAlert({
          message: 'USUARIO YA LOGEADO',
          type: 'success'
        }))
        dispatch(setUser(valueStorage))
    }

    if (!valueStorage.token) {
        return <UserNotLogged/>
    }

  return (
    <div style={{display: 'flex'}}>
        <Container bg={process.env.BLUE_COLOR} >
            <Logo>LOGOTIPO</Logo>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <UserContainer >
                    <IconWrapper>
                        <BsPersonSquare/>
                    </IconWrapper>
                    <div>
                        <User>{user?.usuario || 'NO DEFINIDO'}</User>
                        <LogOut onClick={()=>{
                            dispatch(clearUser())
                            clearValue()
                            setTimeout(() => {
                                router.push('/')
                            }, 2000);
                        }} >Cerrar Sesion</LogOut>
                    </div>
                </UserContainer>
            </div>
            <ListaMenu>
                {itemsLi.map((item,index) => {
                    return(
                        <Link href={"/dashboard/"+(item.toLowerCase().split(' ').join(''))} style={{textDecoration: 'none'}}>
                            <ItemMenu key={index} 
                                isActive={"/"+(item.toLowerCase().split(' ').join('')) === pathname ? true : false}
                                bc={process.env.BLUE_COLOR}
                            >
                                {item}
                            </ItemMenu>
                        </Link>
                    )
                })}
            </ListaMenu>
        </Container>
        {children}
    </div>
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