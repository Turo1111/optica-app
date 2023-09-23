import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const CheckListGroup = ({ items, onItemChange, multiple }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [todo, setTodo] = useState(false)

  const handleItemChange = (item) => {
    if (multiple) {
      const updatedSelection = [...selectedItems];
      const itemIndex = updatedSelection.findIndex(selectedItem => selectedItem._id === item._id);
  
      if (itemIndex === -1) {
        updatedSelection.push(item);
      } else {
        updatedSelection.splice(itemIndex, 1);
      }
  
      setSelectedItems(updatedSelection);
      onItemChange(updatedSelection);
    } else {
      // Si solo se permite la selección de un elemento, selecciona el elemento actual
      setSelectedItems([item]);
      onItemChange([item]);
    }
  };
  

  return (
    <CheckList>
      {
        multiple &&
        <CheckListItem key={99}>
            <CustomCheckbox
              type="checkbox"
              id={99}
              checked={todo}
              onChange={() => {
                setTodo(!todo)
                if (!todo) {
                  setSelectedItems(items);
                  onItemChange(items);
                  return
                }
                setSelectedItems([]);
                onItemChange([]);
              }}
            />
            <Label htmlFor={99}>TODO</Label>
          </CheckListItem>
      }
      {
        items.length === 0 ? 
        <Label>Sin elementos</Label>
        :
        items.map((item) => (
          <CheckListItem key={item._id}>
            <CustomCheckbox
              type="checkbox"
              id={item._id}
              checked={selectedItems.some(selectedItem => selectedItem._id === item._id)}
              onChange={() => handleItemChange(item)}
            />
            <Label htmlFor={item._id}>{item.descripcion}</Label>
          </CheckListItem>
        ))
      }
    </CheckList>
  );
};

const CheckList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CheckListItem = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 15px;

  input[type="checkbox"] {
    margin-right: 5px;
  }
`;

const Label = styled.label `
    font-size: 16px;
    padding: 0 15px;
    font-weight: 500;
    color: ${process.env.TEXT_COLOR};
`

const CustomCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 2px solid ${process.env.BLUE_COLOR};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  &:checked {
    background-color: ${process.env.BLUE_COLOR};
    &::before {
      content: '\u2713'; // Símbolo de verificación
      position: absolute;
      bottom:-4px;
      left: 2px;
      font-size: 18px;
      color: #fff; // Color del símbolo de verificación
    }
  }
`;

export default CheckListGroup;
