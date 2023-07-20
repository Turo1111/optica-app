import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Table from '../Table'
import NewStock from '../NewStock'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import apiClient from '@/utils/client'
import useBarcodeGenerator from '@/hooks/useBarcodeGenerator'
import Loading from '../Loading'
const io = require('socket.io-client')

export default function InfoProduct({token, item}) {

    const [openNewStock, setOpenNewStock] = useState(false)
    const [data, setData] = useState([])
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
    const [stockSelected, setStockSelected] = useState(undefined)

    const { barcodeDataURL } = useBarcodeGenerator(item?.codigo);

    console.log(item)

    useEffect(()=>{
        setLoading(true)
        if (item) {
            apiClient.get(`/stock/${item?._id}` ,
            {
              headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
              }
            })
              .then(r=>{
                setData(r.data.body)
                setLoading(false)
              })
              .catch(e=>dispatch(setAlert({
                message: 'Hubo un error inesperado al cargar los empleados',
                type: 'error'
              })))
        }
    },[item])

    useEffect(()=>{
      
        const socket = io('https://optica-api.onrender.com')
        socket.on('stock', (stock) => {
          setLoading(true)
          setData((prevData)=>{
            const exist = prevData.find(elem => elem._id === stock.res._id )
            setLoading(false)
            if (exist) {
              return prevData.map((item) =>
              item._id === stock.res._id ? stock.res : item
            )
            }
            return [...prevData, stock.res]
          })
        })
        return () => {
          socket.disconnect();
        }; 

      },[data])

  return (
    <div>
        <Descripcion color={process.env.TEXT_COLOR}>{item?.descripcion}</Descripcion>
        <ContainerInfo>
            <div>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Categoria :</label> {item?.categoria}
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Numeracion :</label> {item?.numeracion || 'No definido'}
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Alto :</label> {item?.alto || 'No definido'}
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Ancho :</label> {item?.ancho || 'No definido'}
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Marca :</label> {item?.marca || 'No definido'}
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Color :</label> {item?.color || 'No definido'}
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Precio general :</label> ${item?.precioGeneral || 'No definido'}
                </Caracteristicas>
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Codigo :</label> {item?.codigo || 'No definido'}
                </Caracteristicas>  
                <div>
                    <img src={barcodeDataURL} alt="Barcode" />
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', width: 250, height: 250, padding: 15, backgroundColor: '#d9d9d9', position: 'relative', overflow: 'hidden', borderRadius: 15}} >
              <Image
                  src={`${process.env.URL_BD}/${item?.imagen}`}
                  alt="Imagen del producto"
                  fill
              />
            </div>
        </ContainerInfo>
        {
            loading ?
              <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Loading/>
              </div> 
            :
            <>
                <ButtonNewStock color={process.env.BLUE_COLOR} onClick={()=>setOpenNewStock(true)}>+ NUEVO STOCK</ButtonNewStock>
                {
                    openNewStock ? 
                        <NewStock eClose={()=>setOpenNewStock(false)} idProducto={item._id} item={stockSelected}/>
                    :
                        <Table columns={columns} data={data} onClick={(item)=>{
                          setOpenNewStock(true)
                          setStockSelected(item)
                        }} />
                }
            </>
        }
    </div>
  )
}

const Caracteristicas = styled.h6 `
    font-size: 14px;
    font-weight: 400;
    margin: 15px 0;
    color: ${props=>props.color};
`

const Descripcion = styled.h2 `
    font-size: 18px;
    font-weight: 600;
    margin: 15px 5px;
    color: ${props=>props.color};
`

const ContainerInfo = styled.div `
    display: flex;
    justify-content: space-around;
    background-color: #F9F5F6;
    padding: 15px;
    border-radius: 20px;
    @media only screen and (max-width: 425px) {
        display: block;
    }
`

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
`

const TableRow = styled.li `
    border-radius: 3px;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: ${props=>props.color};
    background-color: #ffffff;
`

const ButtonNewStock = styled.h6 `
    font-size: 14px;
    font-weight: 400;
    margin: 15px 5px;
    color: ${props=>props.color};
    cursor: pointer;
`

const columns = [
    { label: 'Sucursal', field: 'sucursal', width: '40%' },
    { label: 'Stock', field: 'cantidad', width: '10%' },
    { label: 'Precio Efectivo', field: 'precioEfectivo', width: '25%', align: 'center' },
    { label: 'Precio Lista', field: 'precioLista', width: '25%', align: 'center' },
  ];