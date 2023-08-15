import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

export const useResize = () => {

  const [ancho, setAncho] = useState(0)
  const [alto, setAlto] = useState(0)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        setAncho(window.innerWidth)
        setAlto(window.innerHeight)
      })
      if(ancho===0){
        setAncho(window.innerWidth)
        setAlto(window.innerHeight)
      }
    }
  },[])

  return {ancho, alto}
}