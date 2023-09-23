import { useResize } from '@/hooks/useResize'
import { PieChart } from '@mui/x-charts'
import React from 'react'
import styled from 'styled-components'

export default function DataLeft({tipoPago, porSucursal}) {
  
    const {ancho, alto} = useResize()

    /* 
        ancho > 900 = 300
        ancho < 900 = 250

    */

  return (
    <Container >
        <Card>
            <TitleCardHeader>Ventas por tipo de pago</TitleCardHeader>
            <Line/>
            <ContainerChart>
                <PieChart
                    series={[
                        {
                            data: tipoPago,
                            innerRadius: 30,
                            outerRadius: 90,
                            paddingAngle: 5,
                            cornerRadius: 5,
                            startAngle: -180,
                            endAngle: 180,
                            cx: 50,
                            cy: 100,
                        }
                    ]}
                    width={250}
                    height={200}
                    
                />
            </ContainerChart>
        </Card>
        <Card>
            <TitleCardHeader>Ventas por sucursal</TitleCardHeader>
            <Line/>
            <ContainerChart >
                <PieChart
                    series={[
                        {
                            data: porSucursal,
                            innerRadius: 30,
                            outerRadius: 90,
                            paddingAngle: 5,
                            cornerRadius: 5,
                            startAngle: -180,
                            endAngle: 180,
                            cx: 50,
                            cy: 100,
                        }
                    ]}
                    width={250}
                    height={200}
                />
            </ContainerChart>
        </Card>
    </Container>
  )
}

const Card = styled.div `
    width: 325px;
    background-color: #8294C4;
    border-radius: 15px;
    padding: 5px 15px;
    margin: 15px 0;
`

const Line = styled.div `
    border-bottom: 1px solid #fff;
    margin-bottom: 5px;
`

const TitleCardHeader = styled.h5 `
    font-size: 16px;
    color: #fff;
    margin: 10px 0 ;
    font-weight: 600;
`

const ContainerChart = styled.div `
    display: flex; 
    justify-content: center;
    align-items: center; 
    flex: 1;
    margin: 15px 0;
    @media only screen and (max-width: 1440px) {
        margin: 0;
    }
`

const Container = styled.div `
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: 1260px) {
       flex-direction: row;
       justify-content: space-around;
    }
    @media only screen and (max-width: 480px) {
       flex-direction: column;
       margin: 0 auto;
    }
`