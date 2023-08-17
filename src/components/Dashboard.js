import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import {BsPersonSquare} from 'react-icons/bs'
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { clearUser, getUser, setUser } from '@/redux/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setAlert } from '@/redux/alertSlice';
import UserNotLogged from './UserNotLogged';
import useLocalStorage from '@/hooks/useLocalStorage';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdClose } from 'react-icons/md';
import { CSSTransition } from 'react-transition-group'
import useOutsideClick from '@/hooks/useOutsideClick';

/* const itemsLi = ["COMPRA", "CONTABILIDAD"] */
const itemsLi = ["NUEVA VENTA", "VENTA", "PRODUCTOS","GESTION", "CLIENTES"]

export default function Dashboard({children}) {

   const pathname = usePathname()
   const user = useAppSelector(getUser);
   const dispatch = useAppDispatch();
   const router = typeof window !== 'undefined' ? useRouter() : null;
   const [valueStorage , setValue, clearValue] = useLocalStorage("user", "")
   const [openMenu, setOpenMenu] = useState(false)

   const modalRef = useRef(null);

    useOutsideClick(modalRef, ()=>setOpenMenu(false));

   function extractLastPart(pathname) {
    const parts = pathname.split('/');
    return parts[parts.length - 1];
  }

   useEffect(() => {
    const checkUser = async () => {
      if (valueStorage?.token) {
        dispatch(
          setAlert({
            message: 'USUARIO YA LOGEADO',
            type: 'success',
          })
        );
        dispatch(setUser(valueStorage));
      } else {
        await delay(5000); // Esperar 5 segundos antes de redireccionar
        router.push('/');
      }
    };

    checkUser();
  }, [dispatch, router, valueStorage]);

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };


    if (!(valueStorage?.token)) {
        return <UserNotLogged/>
    }

  return (
    <Container>
        <HeaderMobile>
            <IconWrapper onClick={()=>setOpenMenu(!openMenu)} >
                {
                    openMenu ? 
                    <MdClose/>
                    :
                    <AiOutlineMenu/>
                }
            </IconWrapper>
            <h2 style={{fontSize: 22, color: '#fff', textAlign: 'center', marginLeft: 25}} >{extractLastPart(pathname).toUpperCase()}</h2>
        </HeaderMobile>
        <Content>
            <ContainerDashboard bg={process.env.BLUE_COLOR} open={openMenu} >
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
                <ListaMenu ref={modalRef}>
                    {itemsLi.map((item,index) => {
                        return(
                            <Link href={"/dashboard/"+(item.toLowerCase().split(' ').join(''))} style={{textDecoration: 'none'}}>
                                <ItemMenu key={index} 
                                    isActive={"/dashboard/"+(item.toLowerCase().split(' ').join('')) === pathname ? true : false}
                                    bc={process.env.BLUE_COLOR}
                                    onClick={()=>setOpenMenu(false)}
                                >
                                    {item}
                                </ItemMenu>
                            </Link>
                        )
                    })}
                </ListaMenu>
            </ContainerDashboard>
            <div style={{ display: 'flex', flex: 1 }}>
                <Container1>
                    <Container2>
                        {children}
                    </Container2>
                </Container1>
            </div>
        </Content>
    </Container>
  )
}

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

const ContainerDashboard = styled.div `
    background-color: ${props=>props.bg};
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px; 
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 225px;
    @media only screen and (max-width: 768px) {
        position: absolute;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        animation: ${({ open }) => open ? slideIn : slideOut} 1s ease-in-out;
        display: ${({ open }) => open ? 'flex' : 'none'};
        height: -webkit-fill-available;
        z-index: 100;
    }
`

const HeaderMobile = styled.nav `
    display: none;
    @media only screen and (max-width: 768px) {
        display: flex;
        align-items: center;
        padding: 0 15px;
        background-color: ${process.env.BLUE_COLOR}
    }
`

const Content = styled.main `
    display: flex;
    flex: 1;
`

const Container1 = styled.main `
    display: flex;
    flex: 1;
    padding: 15px;
    @media only screen and (max-width: 768px) {
        padding: 0
    }
`

const Container2 = styled.main `
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: #EEEEEE;
    padding: 25px;
    border-radius: 25px;
    @media only screen and (max-width: 768px) {
        padding: 5px;
        border-radius: 0px;
    }
`

const Container = styled.div `
    display: flex;
    height: 100vh;
    position: relative;
    height: 100vh;
    @media only screen and (max-width: 768px) {
        flex-direction: column;
    }
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
    color: ${props=>props.color ? props.color : '#fff'};
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
    height: 50%;
    @media only screen and (max-width: 768px) {
        overflow-y: scroll;
    }
`

const ItemMenu = styled.li `
    list-style: none;
    font-weight: 600;
    font-size: 16px;
    color: ${props=>props.isActive ? props.bc : '#fff'};
    margin: 15px 0;
    padding: 10px;
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
    /* @media only screen and (max-width: 768px) {
        padding: 10px;
    } */
`