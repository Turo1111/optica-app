import React, { useEffect, useState } from 'react';
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
`;

const InputWrapper = styled.div`
  position: relative;
  width: ${props => props.width};
  text-align: center;
  display: flex;
    flex-direction: column;
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
    width: 97%; 
    min-height: 30px;
    max-height: 150px;
    overflow-y: scroll;
    background-color: #fff; 
    left: 5px;
    top: 40px;
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

const InputSearch = ({placeholder, width = '80%', value, onChange, modal, onSelect, data, prop}) => {

  const [openList, setOpenList] = useState(false)

  useEffect(()=>{
    /* console.log(modal, value !== '') */
    if (modal && value !== '') {
      console.log('entro')
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
      />
      {
          openList && (
            <Modal>
              {
                data.length === 0 ? 'Vacio' : 
                data.map((item, index)=> <ItemModal key={index} color={process.env.TEXT_COLOR} onClick={()=>{
                  onSelect(item)
                  setOpenList(false)
                }} >{item[prop]}</ItemModal>)
              }
            </Modal>
          )
        }
    </InputWrapper>
  );
};

export default InputSearch;
