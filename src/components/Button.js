import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'

export default function Button({text, onClick, width='auto', to}) {

  
  return (
    <div>
      {
        to ?
        <Link href={to}>
          <Btn onClick={onClick} bg={process.env.BLUE_COLOR} width={width} >
            {text}
          </Btn>
        </Link>
        :
        <Btn onClick={onClick} bg={process.env.BLUE_COLOR} width={width} >
          {text}
        </Btn>
      }
    </div>
  )
}

const Btn = styled.button `
    border: 0;
    background-color: ${props=>props.bg};
    padding: 10px 25px;
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    width: ${props=>props.width ? props.width : 'auto'};
    margin: 10px 0;
    cursor: pointer;
    :hover{
        background-color: #637195;
    }
`
