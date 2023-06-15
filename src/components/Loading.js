import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingItem = styled.div`
  box-sizing: border-box;
  display: block;
  position: relative;
  width: 80px;
  height: 80px;
  margin: 8px;
`;

const Spinner = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 64px;
  height: 64px;
  border: 8px solid #8294C4;
  border-radius: 50%;
  animation: ${spinAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #8294C4 transparent transparent transparent;

  &:nth-child(1) {
    animation-delay: -0.45s;
  }
  &:nth-child(2) {
    animation-delay: -0.3s;
  }
  &:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

const LoadingText = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: #8294C4;
`;

const Loading = ({text = 'Cargando...'}) => {
  return (
    <LoadingContainer>
      <LoadingItem>
        <Spinner></Spinner>
        <Spinner></Spinner>
        <Spinner></Spinner>
        <Spinner></Spinner>
      </LoadingItem>
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;
