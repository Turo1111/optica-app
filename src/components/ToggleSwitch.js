import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleSwitchContainer = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const Label = styled.span`
  margin-right: 8px;
`;

const ToggleSwitchSlider = styled.span`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  background-color: #ccc;
  border-radius: 34px;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ToggleSwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${ToggleSwitchSlider} {
    background-color: #2196F3;
  }

  &:checked + ${ToggleSwitchSlider}:before {
    transform: translateX(26px);
  }
`;

const ToggleSwitch = ({ label, checked, onChange }) => {

  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <ToggleSwitchContainer>
      {label && <Label style={{color: `${process.env.TEXT_COLOR}`}} >{label} :</Label>}
      <ToggleSwitchInput
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
      />
      <ToggleSwitchSlider />
    </ToggleSwitchContainer>
  );
};

export default ToggleSwitch;