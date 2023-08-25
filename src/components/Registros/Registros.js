import { setAlert } from '@/redux/alertSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getUser } from '@/redux/userSlice';
import apiClient from '@/utils/client'
import React, { useEffect, useState } from 'react'
import Table from '../Table';
import { useInputValue } from '@/hooks/useInputValue';
import { useSearch } from '@/hooks/useSearch';
import InputSearch from '../InputSearch';

export default function Registros() {

    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const [data, setData] = useState([])
    const [tagSearch, setTagSearch] = useState([])

    const search = useInputValue('','')

    const tag = ["accion", "coleccion", "fechaHora"]

    const listReg = useSearch(search.value, tag, data, tagSearch)

    useEffect(()=>{
        setLoading(true)
        apiClient.get(`/reg` ,
        {
          headers: {
            Authorization: `Bearer ${user.token}` // Agregar el token en el encabezado como "Bearer {token}"
          }
        })
            .then(r=>{
                setData(r.data.body)
              setLoading(false)
            })
            .catch(e=>dispatch(setAlert({
              message: `${e.response.data.error}`,
              type: 'error'
            })))
      },[])

  return (
    <div>
            <InputSearch
              placeholder={'Buscar Registros'}
              {...search}
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
        <Table data={listReg} columns={columns} maxHeight={false} />
    </div>
  )
}

const columns = [
    { label: 'Accion', field: 'accion', width: '30%' },
    { label: 'Coleccion', field: 'coleccion', width: '35%' },
    { label: 'Fecha', field: 'fechaHora', width: '35%', date: true },
];