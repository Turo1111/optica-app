import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {IoIosArrowDown} from 'react-icons/io'
import Button from './Button';
import apiClient from '@/utils/client';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getUser } from '@/redux/userSlice';
import { setAlert } from '@/redux/alertSlice';
const io = require('socket.io-client')

const InputWrapper = styled.div`
  position: relative;
  margin: 25px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 1440px) {
    margin: 20px 0;
  }
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
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: ${props => props.color};
    padding: 14px 0;
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
  const dispatch = useAppDispatch();
  const [loading2, setLoading2] = useState(false)

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

  const addValue = (item) => {
    onChange(item._id, item)
    setInputValue(item.descripcion)
    setOpenList(false)
    setIsActive(true);
    setIsFocused(true);
  }

  const cleanValue = () => {
    onChange('', '')
    setInputValue('')
    setIsActive(false);
    setIsFocused(false);
  }

  const postValue = () => {
    setLoading2(true)
    apiClient.post(`/${name}`, {descripcion: inputValue},
    {
      headers: {
        Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
      }
    })
    .then((r)=>{
      onChange(r.data.body._id, r.data.body)
      dispatch(setAlert({
        message: `${label} creada correctamente`,
        type: 'success'
      }))
      setLoading2(false)
    })
    .catch(e=>{
      setLoading2(false)
      dispatch(setAlert({
      message: `${e.response.data.error || 'Ocurrio un error'}`,
      type: 'error'
    }))})
  }

  const patchValue = () => {
    setLoading2(true)
    apiClient.patch(`/${name}/${value}`, {_id: value, descripcion: inputValue},
    {
      headers: {
        Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
      }
    })
    .then((r)=>{
      onChange(r.data.body._id)
      dispatch(setAlert({
        message: `${label} modificada correctamente`,
        type: 'success'
      }))
      setLoading2(false)
    })
    .catch(e=>{
      setLoading2(false)
      dispatch(setAlert({
        message: `${e.response.data.error || 'Ocurrio un error'}`,
        type: 'error'
      }))
    })
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
    .catch(e=>dispatch(setAlert({
      message: `${e.response.data.error || 'Ocurrio un error'}`,
      type: 'error'
    })))
  },[name])

  useEffect(()=>{
    const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
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
    if (value === '' || value === undefined) {
      setInputValue('')
      setIsActive(false);
      setIsFocused(false);
    }else {
      setIsActive(true);
      setIsFocused(true);
    }
  },[value])

  useEffect(()=>{
    if (inputValue !== '') {
      setOpenList(false)
    }
  },[inputValue])

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
        <div style={{display: 'flex', position: 'absolute', right: 15}}>
          <IconWrapper color={process.env.TEXT_COLOR} onClick={()=>setOpenList(!openList)}>
            <IoIosArrowDown/>
          </IconWrapper>
        </div>                              
        :
         (value === '' || value === undefined ) ? 
          <div style={{display: 'flex', position: 'absolute', right: 0}}>
            {
              loading2 ?
              <IconWrapper>
                <Tag color={process.env.TEXT_COLOR}>Cargando..</Tag>
              </IconWrapper>
              :
              <IconWrapper onClick={postValue}>
                  <Tag color={process.env.TEXT_COLOR}>Agregar</Tag>
              </IconWrapper>
            }
          </div>
          :
          <div style={{display: 'flex', position: 'absolute', right: 0}}>
            {
              loading2 ?
              <IconWrapper>
                <Tag color={process.env.TEXT_COLOR}>Cargando..</Tag>
              </IconWrapper>
              :
              <>
                <IconWrapper onClick={patchValue}>
                  <Tag color={process.env.TEXT_COLOR}>Modificar</Tag>
                </IconWrapper>
                <IconWrapper onClick={cleanValue}>
                    <Tag color={process.env.TEXT_COLOR}>Quitar</Tag>
                </IconWrapper>
              </>
            }
            
          </div>
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
                  data.map((item, index)=> <ItemModal key={index} color={process.env.TEXT_COLOR} onClick={()=>addValue(item)} >{item.descripcion}</ItemModal>)
              }
            </>
          }
        </Modal>
      }
    </InputWrapper>
  );
};

export default InputSelectAdd;
