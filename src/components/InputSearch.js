import React, { useState } from 'react';
import styled from 'styled-components';

const InputField = styled.input`
  width: 80%;
  height: 30px;
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

const InputSearch = ({placeholder}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };


  return (
      <InputField
        color={process.env.TEXT_COLOR}
        type={'text'}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
  );
};

export default InputSearch;
