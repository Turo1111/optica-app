import React from 'react'
import Button from './Button'

export default function EmptyList({onClick = null}) {
  return (
    <div style={{flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 0, textAlign: 'center' }}>
        <h2 style={{color: `${process.env.TEXT_COLOR}`}} > NO HAY ELEMENTOS CREADOS </h2>
        {
          onClick && <Button onClick={onClick} text={'NUEVO'} />
        }
    </div>
  )
}
