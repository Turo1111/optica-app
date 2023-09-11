import { setAlert } from '@/redux/alertSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getUser } from '@/redux/userSlice';
import apiClient from '@/utils/client'
import React, { useEffect, useState } from 'react'
import Table from '../Table';
import { useInputValue } from '@/hooks/useInputValue';
import { useSearch } from '@/hooks/useSearch';
import InputSearch from '../InputSearch';

export default function RetiroDineroModal() {

    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const [data, setData] = useState([])
    const [tagSearch, setTagSearch] = useState([])

    const search = useInputValue('','')

    const tag = ["empleado", "total", "fecha"]

    const listReg = useSearch(search.value, tag, data, tagSearch)

    const getRD = () => {
      setLoading(true)
        apiClient.get(`/retirodinero` ,
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
              message: `${e.response.data.error || 'Ocurrio un error'}`,
              type: 'error'
            })))
    }

    useEffect(()=>{
      getRD()
    },[user.token])

  return (
    <div>
            <InputSearch
              placeholder={'Buscar retiros'}
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
  { label: 'Fecha', field: 'fecha', width: '35%', date: true },
  { label: 'Empleado', field: 'empleado', width: '25%', textAlign: 'center'},
  { label: 'Sucursal', field: 'sucursal', width: '25%', textAlign: 'center' },
  { label: 'Total', field: 'total', width: '20%', price: true, textAlign: 'center' },
];