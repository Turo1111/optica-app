'use client'
import EmptyList from '@/components/EmptyList';
import InputSearch from '@/components/InputSearch';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import NotPermissions from '@/components/NotPermissions';
import InfoVenta from '@/components/Ventas/InfoVenta';
import ItemVenta from '@/components/Ventas/ItemVenta';
import PagarDeuda from '@/components/Ventas/PagarDeuda';
import PrintSale from '@/components/Ventas/PrintSale';
import { useInputValue } from '@/hooks/useInputValue';
import { useSearch } from '@/hooks/useSearch';
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getUser } from '@/redux/userSlice';
import apiClient from '@/utils/client';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import io from 'socket.io-client'; 

export default function Venta() {
 
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const user = useAppSelector(getUser);
  const [permission, setPermission] = useState(false)
  const dispatch = useAppDispatch();
  const [ventaSelected, setVentaSelected] = useState(undefined)
  const [openInfo, setOpenInfo] = useState(false)
  const [openSaldo, setOpenSaldo] = useState(false)
  const [tagSearch, setTagSearch] = useState([])
  const [openPrint, setOpenPrint] = useState(false)

  const search = useInputValue('','')

  const tag = ["cliente", "sucursal", 'empleado']

  const listVentas = useSearch(search.value, tag, data, tagSearch)

  useEffect(()=>{
    if (user.usuario !== '') {  
      user.roles.permisos.forEach((permiso) => {
          if (permiso.screen.toLowerCase() === 'venta') {
            if (!permiso.lectura) {
              return setPermission(false)
            }
            return setPermission(true)
          }
      });
    }
  },[user])

  const getVenta = () => {
    setLoading(true)
    if (user.token) {
      apiClient.get('/venta' ,
      {
        headers: {
          Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
        .then(r => {
          setData((prevData)=>{
            setLoading(false)
            return r.data.body
          })
        })
        .catch(e => dispatch(setAlert({
          message: `${e.response.data.error || 'Ocurrio un error'}`,
          type: 'error'
        })))
    }
  }

  useEffect(() => {
    getVenta()
  }, [user.token])

  useEffect(()=>{
    
      // Código que depende de self o del navegador
      const socket = io(process.env.NEXT_PUBLIC_DB_HOST);
      // Resto del código
      
      socket.on('venta', (venta) => {
        setData((prevData)=>{
          const exist = prevData.find(elem => elem._id === venta.res._id )
          if (exist) {
            return prevData.map((item) =>
            item._id === venta.res._id ? venta.res : item
          )
          }
          return [...prevData, venta.res]
        })
      })
      return () => {
        socket.disconnect();
      }; 
    
  },[data])

  if (!permission) {
    return <NotPermissions/>
  }

return (
    <>
      {
        loading ? 
        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Loading/>
        </div> 
        :
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputSearch placeholder={'Buscar Ventas'} {...search} width='100%'
              tags={tag}
              tagSearch={tagSearch}
              deleteTagSearch={(item) => setTagSearch((prevData) => prevData.filter((elem) => elem.tag !== item.tag))}
              onSelectTag={(search, tag) =>
                tag !== 'SIN ETIQUETA' &&
                setTagSearch((prevData) =>
                  !prevData.find((elem) => elem.tag === tag) ? [...prevData, { search, tag }] : prevData
                )
              }
            />
          </div>
          <List>
            {
              listVentas.length === 0 ?
              <EmptyList onClick={() => setOpenNewProduct(true)} />
              :
              listVentas.map((item, index) => (
                <ItemVenta
                  key={index}
                  {...item}
                  handleOpenInfo={()=>{
                    if (ventaSelected !== undefined) {
                      // Abre el modal de impresión
                      setOpenInfo(true)
                      setVentaSelected(item)
                    }
                  }}
                  handleOpenSaldo={()=>{
                    if (ventaSelected !== undefined) {
                      // Abre el modal de impresión
                      setOpenSaldo(true)
                      setVentaSelected(item)
                    }
                  }}
                  handleOpenPrint={()=>{
                    if (ventaSelected !== undefined) {
                      // Abre el modal de impresión
                      setOpenPrint(true)
                      setVentaSelected(item)
                    }
                  }}
                />
              ))
            }
          </List>
        </>
      }
      {
        openInfo && 
        <Modal 
          open={openInfo} 
          eClose={()=>setOpenInfo(false)} 
          title={'INFO DE LA VENTA'} 
          height='95%'
          width='35%'
        >
          <InfoVenta {...ventaSelected} token={user.token}/>
        </Modal>
      }
      {
        openSaldo && 
        <Modal 
          open={openSaldo} 
          eClose={()=>setOpenSaldo(false)} 
          title={'PAGAR DEUDA'} 
          height='auto'
          width='35%'
        >
          <PagarDeuda venta={ventaSelected} handleClose={()=>setOpenSaldo(false)} token={user.token} idSucursal={user.idSucursal} />
        </Modal>
      }
      {
        openPrint && 
        <Modal 
          open={openPrint} 
          eClose={()=>setOpenPrint(false)} 
          title={'Imprimir venta'} 
          height='auto'
          width='35%'
        >
          <PrintSale id='print' onClose={()=>setOpenPrint(false)}
            _id={ventaSelected._id}
            cliente={ventaSelected.cliente}
            fecha={(ventaSelected.fecha)}
            obraSocial={ventaSelected.obraSocial}
            orden={ventaSelected.orden}
            tipoPago={ventaSelected.tipoPago}
            dineroIngresado={ventaSelected.dineroIngresado}
            carrito={[]}
            descuento={ventaSelected.descuento}
            subTotal={ventaSelected.subTotal}
            total={ventaSelected.total}
            useSenia={ventaSelected.useSenia}
            token={user.token}
        />
        </Modal>
      }
    </>
  ) 
}

const List = styled.ul `
  flex: 1;
  background-color: #fff; 
  border-radius: 15px;
  padding: 0;
  overflow-y: scroll;
` 