import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Table from '../Table'
import NewStock from './NewStock'
import { useAppDispatch } from '@/redux/hook'
import { setAlert } from '@/redux/alertSlice'
import apiClient from '@/utils/client'
import useBarcodeGenerator from '@/hooks/useBarcodeGenerator'
import Loading from '../Loading'
import useFormatArrayString from '@/hooks/useFormatArrayString'
import Modal from '../Modal'
import NewOferta from './NewOferta'
import { MdEdit } from 'react-icons/md'
import { BiTransfer } from 'react-icons/bi'
import Button from '../Button'
const io = require('socket.io-client')

export default function InfoProduct({token, item, handleOpenEditModal, handleOpenTransferModal}) {

    const [openNewStock, setOpenNewStock] = useState(false)
    const [data, setData] = useState([])
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
    const [stockSelected, setStockSelected] = useState(undefined)
    let listObraSocial = useFormatArrayString(item?.obrasSocialesDescuento)
    const [openNewSale, setOpenNewSale] = useState(false)
    const [ofertaSelected, setOfertaSelected] = useState(undefined)
    const [ofertas, setOfertas] = useState([])

    const { barcodeDataURL, downloadBarcodeImage  } = useBarcodeGenerator(item?.codigo);

    function getStockOferta() {
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
              message: `${e.response.data.error || 'Ocurrio un error'}`,
              type: 'error'
            })))
            apiClient.get(`/oferta/${item?._id}` ,
          {
            headers: {
              Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
            }
          })
            .then(r=>{
              setOfertas(r.data.body)
              setLoading(false)
            })
            .catch(e=>dispatch(setAlert({
              message: `${e.response.data.error || 'Ocurrio un error'}`,
              type: 'error'
            })))
        }
    }

    useEffect(()=>{
      getStockOferta()
    },[item])

    useEffect(()=>{
        const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
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
        socket.on('oferta', (oferta) => {
          setLoading(true)
          setOfertas((prevData)=>{
            const exist = prevData.find(elem => elem._id === oferta.res._id )
            setLoading(false)
            if (exist) {
              return prevData.map((item) =>
              item._id === oferta.res._id ? oferta.res : item
            )
            }
            return [...prevData, oferta.res]
          })
        })
        return () => {
          socket.disconnect();
        }; 

      },[data])

  return (
    <div>
        <div style={{display: 'flex', margin: '15px 0', justifyContent: 'space-between'}} >
          <Descripcion color={process.env.TEXT_COLOR}>{item?.descripcion}</Descripcion>
          <div style={{display: 'flex'}}>
            <IconWrapper bg={'#FCDDB0'} hover={'#E1BA82'} onClick={()=>handleOpenEditModal(item)}>
                <MdEdit/>
            </IconWrapper>
            <IconWrapper bg={'#A2CDB0'} hover={'#85A389'} onClick={()=>handleOpenTransferModal(item)}>
                <BiTransfer/>
            </IconWrapper>
          </div>
        </div>
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
                    <label style={{fontWeight: 600}}>Proveedor :</label> {item?.proveedor || 'No definido'}
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
                <Caracteristicas color={process.env.TEXT_COLOR}>
                    <label style={{fontWeight: 600}}>Descuento con :</label> {listObraSocial || 'No definido'}
                </Caracteristicas>  
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  <Image src={barcodeDataURL} alt="Barcode" width={200} height={180} />
                  <Button text={'Descargar Barcode'} onClick={downloadBarcodeImage} />
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
                <div style={{display: 'flex'}} >
                  <ButtonNewStock color={process.env.BLUE_COLOR} onClick={()=>{
                    if (item._id === '64f0ca05ae80e2477accbc24' || item._id === '64f0c9e9ae80e2477accbc14') {
                      dispatch(setAlert({
                        message: `No puede crear stock del producto`,
                        type: 'error'
                      }))
                      return
                    }
                    setOpenNewStock(true)
                  }}>+ NUEVO STOCK</ButtonNewStock>
                  <ButtonNewStock color={process.env.BLUE_COLOR} onClick={()=>{
                    if (item._id === '64f0ca05ae80e2477accbc24' || item._id === '64f0c9e9ae80e2477accbc14') {
                      dispatch(setAlert({
                        message: `No puede crear oferta del producto`,
                        type: 'error'
                      }))
                      return
                    }
                    setOpenNewSale(true)
                  }}>+ NUEVA OFERTA</ButtonNewStock>
                </div>
                {
                  data.length === 0 ? 
                  <div style={{color: `${process.env.TEXT_COLOR}`, textAlign: 'center', margin: '15px 0'}}>No hay stock creado</div>:
                  <Table columns={columns} data={data} onClick={(item)=>{
                    setOpenNewStock(true)
                    setStockSelected(item)
                  }} />
                }
                {
                  ofertas.length === 0 ?
                  <div style={{color: `${process.env.TEXT_COLOR}`, textAlign: 'center', margin: '15px 0'}}>No hay oferta creada</div>:
                  <Table date={true} columns={columns1} data={ofertas} onClick={(item)=>{
                    setOpenNewSale(true)
                    setOfertaSelected(item)
                  }} />
                }
            </>
        }
        {
          openNewSale && 
          <Modal
            open={openNewSale}
            title={'Nueva oferta'}
            height='auto'
            width='50%'
            eClose={()=>{
              setStockSelected(undefined)
              setOpenNewSale(false)
            }}
          >
            <NewOferta token={token} item={ofertaSelected} producto={item} eClose={()=>{
              setStockSelected(undefined)
              setOpenNewSale(false)
            }}/>
          </Modal>
        }
        {
          openNewStock && 
          <Modal
            open={openNewStock}
            title={'Nuevo stock'}
            height='auto'
            width='50%'
            eClose={()=>{
              setStockSelected(undefined)
              setOpenNewStock(false)
            }}
          >
            <NewStock eClose={()=>{
              setStockSelected(undefined)
              setOpenNewStock(false)
            }} idProducto={item._id} item={stockSelected} precioGeneral={item.precioGeneral}/>
          </Modal>
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
    @media only screen and (max-width: 445px) {
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

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    color: #fff;
    background-color: ${props=>props.bg || '#fff'};
    padding: 15px;
    :hover{
        background-color: ${props=>props.hover || '#d9d9d9'};
    }
    @media only screen and (max-width: 445px) {
        font-size: 18px;
    }
`

const columns = [
    { label: 'Sucursal', field: 'sucursal', width: '40%' },
    { label: 'Stock', field: 'cantidad', width: '10%' },
    { label: 'Precio Efectivo', field: 'precioEfectivo', width: '25%', align: 'center' },
    { label: 'Precio Lista', field: 'precioLista', width: '25%', align: 'center' },
];

const columns1 = [
  { label: 'Inicio', field: 'fechaInicio', width: '40%', date: true},
  { label: 'Final', field: 'fechaFinal', width: '40%', date: true},
  { label: 'Descuento', field: 'descuento', width: '20%'}
];