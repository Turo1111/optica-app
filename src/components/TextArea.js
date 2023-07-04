import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TextAreaWrapper = styled.div`
  position: relative;
  margin: 25px 0;
  width: -webkit-fill-available;
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const TextAreaLabel = styled.label`
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

const TextAreaField = styled.textarea`
  height: 100px;
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

const TextArea = ({ label, value, onChange, name, required }) => {
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
    <TextAreaWrapper>
      <TextAreaLabel active={isActive} color={process.env.TEXT_COLOR}>
        {label}
        {required && ' - Campo requerido'}
      </TextAreaLabel>
      <TextAreaField
        color={process.env.TEXT_COLOR}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        focused={isFocused}
      />
    </TextAreaWrapper>
  );
};

export default TextArea;
