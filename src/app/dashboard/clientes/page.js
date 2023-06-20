'use client'
import Loading from '@/components/Loading'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { getUser } from '@/redux/userSlice'
import React, { useState } from 'react'

export default function Clientes() {

  const [clientSelected, setClientSelected] = useState(undefined)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const user = useAppSelector(getUser);
  const [permission, setPermission] = useState(false)
  const dispatch = useAppDispatch();
  const search = useInputValue('','')

  const tag = ["nombreCompleto", "telefono", "dni"]

  const listCliente = useSearch(search.value, tag, data)

  useEffect(()=>{
      user.roles.permisos.forEach((permiso) => {
          if (permiso.screen.toLowerCase() === 'cliente') {
            if (!permiso.lectura) {
              return setPermission(false)
            }
            return setPermission(true)
          }
      });
  },[])

    

  useEffect(() => {
    setLoading(true)
    apiClient.get('/cliente',
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
      .catch(e => console.log(e))
  }, [])

  useEffect(()=>{
    const socket = io('http://localhost:3001')
    socket.on('cliente', (cliente) => {
      setData((prevData)=>{
        const exist = prevData.find(elem => elem._id === cliente.res._id )
        if (exist) {
          return prevData.map((item) =>
          item._id === cliente.res._id ? cliente.res : item
        )
        }
        return [...prevData, cliente.res]
      })
    })
    return () => {
      socket.disconnect();
    }; 
  },[data])

  useEffect(()=>{
    if (true) {
      user.roles.permisos.forEach((permiso) => {
        if (permiso.screen.toLowerCase() === 'cliente') {
          if (!permiso.escritura) {
            dispatch(setAlert({
              message: 'NO TIENES PERMISOS DE USUARIO',
              type: 'error'
            }))
          }
        }
      });
    }
  },[])

  if (!permission) {
    return <h2>no tiene permisos</h2>
  }

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <div style={{ flex: 1, display: 'flex', padding: 15 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 25, backgroundColor: '#EEEEEE', borderRadius: 25 }} >
          {
            loading ? 
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Loading/>
            </div> 
            :
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <InputSearch placeholder={'Buscar Clientes'} {...search} />
                <Button text={'NUEVO'} onClick={() => ''} />
              </div>
              <ul style={{ flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0 }}>
                {
                  listCliente.length === 0 ?
                  <EmptyList onClick={() => ''} />
                  :
                  listCliente.map((item, index) => (
                    <div
                      key={index}
                      item={item}
                    >
                      {item}
                    </div>
                  ))
                }
              </ul>
            </>
          }
        </div>
      </div>
    </div>
  )
}
