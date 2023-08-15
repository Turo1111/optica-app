import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  position: relative;
  margin: 25px 0;
  width: -webkit-fill-available;
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

const Prefix = styled.div`
  position: absolute;
  top: 13px;
  left: 10px;
  font-size: 16px;
  color: ${props => props.color};
  display: flex;
  align-items: center;
`;

const InputField = styled.input`
  height: 35px;
  padding: 5px 10px;
  font-size: 16px;
  color: ${props => props.color};
  border-radius: 10px;
  border: ${({ focused }) => (focused ? '2px solid #7286D3' : '1px solid #d9d9d9')};
  transition: border-color 0.2s ease-in-out;
  padding-left: ${({ hasPrefix }) => (hasPrefix ? '30px' : '10px')};

  &:focus {
    outline: none;
  }
`;

const Input = ({ type = 'text', label, value, onChange, name, required, readOnly, prefix }) => {
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

  useEffect(() => {
    if (value === '') {
      setIsActive(false);
      setIsFocused(false);
    } else {
      setIsActive(true);
      setIsFocused(true);
    }
  }, [value]);

  return (
    <InputWrapper>
      {prefix && <Prefix color={process.env.TEXT_COLOR}>{prefix}</Prefix>}
      <InputLabel active={type === 'date' ? true : isActive} color={process.env.TEXT_COLOR}>
        {label}
        {required && ' - Campo requerido'}
      </InputLabel>
      <InputField
        color={process.env.TEXT_COLOR}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        focused={isFocused}
        readOnly={readOnly}
        hasPrefix={!!prefix}
      />
    </InputWrapper>
  );
};

export default Input;
