import React from "react"
import { AiOutlineClose } from "react-icons/ai"
import styled from "styled-components"

const Modal = ({
    children,
    open = false,
    eClose,
    title,
    modalButton = false,
    onButton1,
    onButton2,
    borderRadius = false,
    width = "30%",
    height = "35%",
    el
}) => {
    return (
        <Container open={open}>
            <Content
                borderRadius = {borderRadius}
                width={width}
                height={height}
                ref={el}
            >   
                <ModalHeader title={title}>
                    <Header>
                      <Title>
                        {title}
                      </Title>
                    </Header>
                    <IconWrapper onClick={eClose} >
                        <AiOutlineClose/>
                    </IconWrapper>
                </ModalHeader>
                <ModalContent>
                    {children}
                </ModalContent>
                {/* <ModalButton modalButton={modalButton}>
                    <Button onClick={onButton1} >Cancelar</Button>
                    <Button onClick={onButton2} >Aceptar</Button>
                </ModalButton> */}
            </Content>
        </Container>
    )
}

export default Modal

const Container = styled.div `
  display: ${props => props.open ? 'flex': 'none'};
  position: fixed; /* Stay in place */
  z-index: 2; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  justify-content: center;
  align-items: center;
  transform: scale(1);
`

const Content = styled.div `
  background-color: white;
  border: 1px solid #888;
  width: ${props => props.width && props.width };
  height: ${props => props.height && props.height };
  border-radius: ${props => props.borderRadius ? '10px': '0'};
  position: relative;
  max-width: 1386px;
  max-height: 766px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 1024px) {
    width: auto;
  }
  @media only screen and (max-width: 768px) {
    height: auto;
    width: 95%;
  }
`

const IconWrapper = styled.div `
    margin: 0 10px;
    font-size: 15px;
    text-align: end;
    cursor: pointer;
    :hover{
        color: #FF7878;
    }
`

const ModalContent = styled.div `
  flex: 1;
  padding: 0 20px;
  overflow-y: scroll;
  @media only screen and (max-width: 768px) {
    padding: 5px;  
    overflow-y: scroll;
  }
`

const ModalButton = styled.div `
  display: ${props => props.modalButton ? "flex" : "none" };
  justify-content: end;
  position: absolute;
  bottom: 0;
  width: 94%;
  margin-bottom: 5px;
`

const Button = styled.button `
    padding: 10px 30px;;
    font-size: 12px;
    color: #FF7878;
    border: 1px solid #FF7878;
    background: transparent;
    border-radius: 10px;
    margin: 5px;
    :hover{
        background-color: #FF7878;
        color: white;
    }
`

const ModalHeader = styled.div `
  display: ${props => props.title ? "flex" : "none" };
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid #d9d9d9;
  @media only screen and (max-width: 1023px) {
    padding: 5px;  
  }
`

const Header = styled.div `
 width: 100%;
 height: 40px;
 display: flex;
 align-items: center;
 padding: 0 10px;
 @media only screen and (max-width:1023px) {
  height: 20px;
 }
`

const Title = styled.div `
 font-size: 16px;
 margin: 0 10px;
 display: flex;
 align-items: center;
 color: #716A6A;
 font-weight: bold;
 @media only screen and (max-width: 1440px) {
  font-size: 23px;
 }
 @media only screen and (max-width: 1366px) {
   font-size: 18px;
 }
 @media only screen and (max-width: 1024px) {
   font-size: 16px;
 }
 @media only screen and (max-width: 425px) {
   font-size: 14px;
 }
`