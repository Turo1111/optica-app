import React from 'react'
import styled from 'styled-components'
import InputSearch from '../InputSearch'
import EmptyList from '../EmptyList'
import ItemCartProduct from './ItemCartProduct'

export default function SelectProduct({
    searchProduct,
    listProducto,
    tag,
    tagSearch,
    deleteTagSearch,
    onSelectTag,
    cart = [],
    pago,
    deleteItemCart,
    changeCart,
    onSelectProduct
}) {

  return (
    <ContainerCart>
        <div style={{}}>
          <InputSearch placeholder={'Buscar Productos'} {...searchProduct} width='100%' data={listProducto} modal={true} prop={'descripcion'} onSelect={onSelectProduct} 
          tags={tag}
          tagSearch={tagSearch}
          deleteTagSearch={deleteTagSearch}
          onSelectTag={onSelectTag}
          />
        </div>
        <List>
            {
              cart.length === 0 ?
              <EmptyList />
              :
              cart.map((item, index) => (
                <ItemCartProduct
                    key={index}
                    item={item}
                    tipoPago={pago.descripcion === 'EFECTIVO' ? true : false}
                    deleteItem={deleteItemCart}
                    changeCart={changeCart}
                />
              ))
            }
        </List>
    </ContainerCart>
  )
}

const ContainerCart = styled.div `
  display: flex; 
  flex-direction: column;
  flex: 1; 
  margin-top: 6px;
  margin-right: 15px;
  @media only screen and (max-width: 800px) {
    width: auto;
    display: block;
    flex: 0;
  }
  `

  const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  margin:0;
  margin-top: 8px;
  overflow-y: scroll;
  @media only screen and (max-width: 800px) {
    height: 350px
  }
`