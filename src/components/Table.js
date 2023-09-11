import { useDate } from '@/hooks/useDate'
import React from 'react'
import styled from 'styled-components'

export default function Table({data = [], columns, onClick, date=false, maxHeight = true}) {
  return (
    <List maxHeight={maxHeight}>
        <TableHeader color={process.env.TEXT_COLOR}>
            {columns.map((column, index) => (
              <div key={index} style={{ flexBasis: column.width, textAlign: column.align }}>
                {column.label}
              </div>
            ))}
        </TableHeader>
        {
            data.length === 0 ?
                <TableRow>
                    <div style={{textAlign: 'center'}} data-label="Sucursal">NO HAY ELEMENTOS</div>
                </TableRow>
            :
            data.map((item,index)=>(
                <TableRow key={index} onClick={()=>onClick(item)} color={process.env.TEXT_COLOR} >
                    {columns.map((column, columnIndex) => (
                      <div
                        key={columnIndex}
                        style={{ flexBasis: column.width, textAlign: column.align }}
                        data-label={column.label}
                      >
                        {column.date ? 
                          new Date(item[column.field])
                          :
                          (column.price ? 
                            `$ ${item[column.field]?.toString()}` 
                            : 
                            item[column.field]?.toString())
                        }
                      </div>
                    ))}
                </TableRow>
            ))
        }
    </List>
  )
}

const TableHeader = styled.li `
    border-radius: 3px;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: ${props=>props.color};
    background-color: #F9F5F6;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    @media only screen and (max-width: 800px) {
      font-size: 12px;
    }
    @media only screen and (max-width: 445px) {
      font-size: 10px;
    }
`

const TableRow = styled.li `
    border-radius: 3px;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: ${props=>props.color};
    background-color: #ffffff;
    cursor: ${props=>props.onClick && 'pointer'};
    :hover{
        background-color: ${props=>props.onClick && '#F9F5F6'};
    };
    @media only screen and (max-width: 800px) {
      font-size: 12px;
    }
    @media only screen and (max-width: 445px) {
      font-size: 10px;
    }
`
const List = styled.ul `
  max-height: ${props => !props.maxHeight ? 'none' : '300px' };
  padding: 0;
  overflow: scroll;
  min-width: 550px;
`
