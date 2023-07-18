import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {IoIosArrowDown} from 'react-icons/io'
import Button from './Button';
import apiClient from '@/utils/client';
import { useFormik } from 'formik';
import { useAppSelector } from '@/redux/hook';
import { getUser } from '@/redux/userSlice';
const io = require('socket.io-client')


const InputWrapper = styled.div`
  position: relative;
  margin: 25px 0;
  text-align: center;
  display: flex;
    flex-direction: column;
`;

const InputLabel = styled.label`
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 14px;
  color: ${props => props.color};
  transition: transform 0.2s ease-in-out;
  transform-origin: top left;
  pointer-events: none;

  ${({ active }) =>
    active &&
    `
    transform: translateY(-32px) scale(0.8);
  `}
`;

const InputField = styled.input`
  height: 35px;
  padding: 5px 10px;
  font-size: 16px;
  color: ${props => props.color};
  border-radius: 10px;
  border: ${({ focused }) => (focused ? '2px solid #7286D3' : '1px solid #d9d9d9')};
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
  }
`;

const IconWrapper = styled.div`
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: ${props => props.color};
    padding: 15px;
    right: 0;
    cursor: pointer;
`
const Tag = styled.label `
    font-size: 16px;
    padding: 0 15px;
    color: ${props=>props.color};
    cursor: pointer;
`

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
    width: 100%; 
    min-height: 30px;
    max-height: 150px;
    overflow-y: scroll;
    background-color: #fff; 
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

const InputSelectAdd = ({type = 'text', label, value, onChange, name, edit = false}) => {
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [openList, setOpenList] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const user = useAppSelector(getUser);

  const [inputValue, setInputValue] = useState(edit ? value : '')

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputFocus = () => {
    setIsActive(true);
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsActive(inputValue !== '');
    setIsFocused(false);
  };

  const addValue = (_id, value) => {
    onChange(_id)
    setInputValue(value)
    setOpenList(false)
    setIsActive(true);
    setIsFocused(true);
  }

  const cleanValue = () => {
    onChange('')
    setInputValue('')
    setIsActive(false);
    setIsFocused(false);
  }

  const postValue = () => {
    apiClient.post(`/${name}`, {descripcion: inputValue},
    {
      headers: {
        Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
      }
    })
    .then((r)=>onChange(r.data.body._id))
    .catch(e=>console.log(e))
  }

  useEffect(()=>{
    setLoading(true)
    apiClient.get(`/${name}`,
    {
      headers: {
        Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
      }
    })
    .then((r)=>{
      setLoading(false)
      setData(r.data.body)
    })
    .catch(e=>console.log(e))
  },[name])

  useEffect(()=>{
    const socket = io('https://optica-api.onrender.com')
    socket.on(`${name}`, (socket) => {
      setData((prevData)=>{
        const exist = prevData.find(elem => elem._id === socket.res._id )
        if (exist) {
          return prevData.map((item) =>
          item._id === socket.res._id ? socket.res : item
        )
        }
        return [...prevData, socket.res]
      })
    })
    return () => {
      socket.disconnect();
    }; 
  },[data])

  useEffect(()=>{
    if (value === '') {
      setInputValue('')
      setIsActive(false);
      setIsFocused(false);
    }else {
      setIsActive(true);
      setIsFocused(true);
    }
  },[value])

  return (
    <InputWrapper>
      <InputLabel active={isActive} color={process.env.TEXT_COLOR} >{type === 'date' ? '' : label}</InputLabel>
      <InputField
        color={process.env.TEXT_COLOR}
        type={type}
        value={inputValue} 
        onChange={handleInputChange}
        name={name}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        focused={isFocused}
      />
      {
        inputValue === '' ?                                
        <IconWrapper color={process.env.TEXT_COLOR} onClick={()=>setOpenList(!openList)}>
            <IoIosArrowDown/>
        </IconWrapper>
        :
         value === '' ? 
          <IconWrapper onClick={postValue}>
              <Tag color={process.env.TEXT_COLOR}>Agregar</Tag>
          </IconWrapper>
          :
          <IconWrapper onClick={cleanValue}>
              <Tag color={process.env.TEXT_COLOR}>Quitar</Tag>
          </IconWrapper>
      }
      {
        openList && 
        <Modal>
          {
            loading ? 
              <LoadingText>Cargando...</LoadingText>
            :
            <>
              {
                  data.length === 0 ? 'Vacio' : 
                  data.map((item, index)=> <ItemModal key={index} color={process.env.TEXT_COLOR} onClick={()=>addValue(item._id, item.descripcion)} >{item.descripcion}</ItemModal>)
              }
            </>
          }
        </Modal>
      }
    </InputWrapper>
  );
};

export default InputSelectAdd;
