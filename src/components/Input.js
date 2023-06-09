import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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

const Input = ({type = 'text', label, value, onChange, name, required}) => {

  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = () => {
    setIsActive(true);
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsActive(value !== '');
    setIsFocused(false);
  };

  useEffect(()=>{
    if (value === '') {
      setIsActive(false);
      setIsFocused(false);
    }else{
      setIsActive(true);
      setIsFocused(true);
    }
  },[value])

  return (
    <InputWrapper>
      <InputLabel active={isActive} color={process.env.TEXT_COLOR} >{type === 'date' ? '' : label}{required && ' - Campo requerido' }</InputLabel>
      <InputField
        color={process.env.TEXT_COLOR}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        focused={isFocused}
      />
    </InputWrapper>
  );
};

export default Input;
