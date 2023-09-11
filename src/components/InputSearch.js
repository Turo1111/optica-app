import useOutsideClick from '@/hooks/useOutsideClick';
import { useResize } from '@/hooks/useResize';
import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import styled from 'styled-components';

const InputField = styled.input`
  height: 30px;
  padding: 5px 10px;
  font-size: 16px;
  color: ${props => props.color};
  border-radius: 10px;
  border: ${({ focused }) => (focused ? '2px solid #7286D3' : '1px solid #d9d9d9')};
  transition: border-color 0.2s ease-in-out;
  margin-right: 5px;
  &:focus {
    outline: none;
  }
  @media only screen and (max-width: 445px) {
    font-size: 12px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: ${props => props.width};
  text-align: center;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 445px) {
    width: 100%;
  }
`;

const ItemModal = styled.li `
    font-size: 16px;
    padding: 5px 15px;
    color: ${props=>props.color};
    cursor: pointer;
    list-style: none;
    :hover{
        background-color: #F9F5F6;
    }
`

const Modal = styled.ul`
    position: absolute; 
    width: 99%; 
    min-height: 30px;
    max-height: 150px;
    overflow-y: scroll;
    background-color: #fff; 
    left: px;
    top: 35px;
    z-index: 2;
    /* box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); */
    border: 1px solid #d9d9d9;
    border-top: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    margin: 0;
    padding: 0;
`

const LoadingText = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: #8294C4;
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: ${props => props.color};
    padding: 15px 0px;
    padding-right: 5px;
    cursor: pointer;
    @media only screen and (max-width: 445px) {
      font-size: 15px;
    }
`

const ContainerAdd = styled.h5`
  margin: 0 5px; 
  color: ${process.env.TEXT_COLOR}; 
  cursor: pointer;
  @media only screen and (max-width: 445px) {
    font-size: 12px;
  }
`
const ContainerTag = styled.li `
  font-size: 18px;
  font-weight: 500;
  margin: 0px ; 
  color: white;
  padding: 5px 15px;
  border-radius: 10px;
  background-color: #d9d9d9; 
  margin-right: 15px; 
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const ContainerTagSearch = styled.ul`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  margin-top: 10px;
  overflow-x: auto;
  flex: 1;
  width: ${props => props.ancho <= 1000 ? `${props.ancho - 120}px`: `${props.ancho - 650}px`} ;
`;


const InputSearch = ({placeholder, width = '80%', deleteTagSearch, tagSearch = [], value, onChange, modal, onSelect, data, prop, tags = [], onSelectTag, customItemModal = undefined}) => {
  
  const [openList, setOpenList] = useState(false)
  const [openTagList, setOpenTagList] = useState(false)
  const [tagSelected, setTagSelected] = useState('SIN ETIQUETA')
  let {ancho, alto} = useResize()

  const modalRef = useRef(null);

  useOutsideClick(modalRef, () => setOpenList(false));
  
  useEffect(()=>{
    if (modal && value !== '') {
      setOpenList(true)
    }
    else{
      setOpenList(false)
    }
  },[value])

  return (
    <InputWrapper 
    width={width}>
      <InputField
        color={process.env.TEXT_COLOR}
        type={'text'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={()=>(data?.length !== 0 && data !== undefined) && setOpenList(true)}
      />
      {
        tagSearch.length !==0 && (    
          <ContainerTagSearch ancho={ancho} alto={alto} >
            {
              tagSearch.map((item)=> 
                <ContainerTag onClick={()=>deleteTagSearch(item)} key={item.tag} >
                  {item.search} - {item.tag}
                  <MdClose style={{marginLeft: 5}}/>
                </ContainerTag>
              )
            }
          </ContainerTagSearch>
        )
      }
      {
        tags.length !== 0 && (
          <div style={{display: 'flex', position: 'absolute', right: 5, alignItems: 'center'}} >
            <ContainerAdd
              onClick={()=>onSelectTag(value, tagSelected)}  >AGREGAR</ContainerAdd>
            <ContainerAdd>{tagSelected.toUpperCase()}</ContainerAdd>
            <IconWrapper color={process.env.TEXT_COLOR} onClick={()=>setOpenTagList(!openTagList)}>
                  <IoIosArrowDown/>
            </IconWrapper>
            {
              openTagList && (
                <Modal ref={modalRef}>
                  {
                    tags?.length === 0 ? 'Vacio' : 
                    (tags.concat(['SIN ETIQUETA']))?.map((item, index)=> <ItemModal key={index} color={process.env.TEXT_COLOR} onClick={()=>{
                      setTagSelected(item)
                      setOpenTagList(false)
                    }} >{item.toUpperCase()}</ItemModal>)
                  }
                </Modal>
              )
            }
          </div>
        )
      }
      {
          openList && (
            <Modal ref={modalRef}>
              {
                data?.length === 0 ? 'Vacio' : 
                data?.map((item, index)=> <ItemModal key={index} color={process.env.TEXT_COLOR} onClick={()=>{
                  onSelect(item)
                  setOpenList(false)
                }} >{
                  customItemModal ?
                  customItemModal(item)
                  : 
                  item[prop]
                }</ItemModal>)
              }
            </Modal>
          )
        }
    </InputWrapper>
  );
};

export default InputSearch;
