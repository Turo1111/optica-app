import React, { useState } from 'react';
import styled from 'styled-components';

const InputField = styled.input`
  width: ${props => props.width};
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

const InputSearch = ({placeholder, width = '80%', value, onChange}) => {

  return (
      <InputField
        color={process.env.TEXT_COLOR}
        type={'text'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        width={width}
      />
  );
};

export default InputSearch;
