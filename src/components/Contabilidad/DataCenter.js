import { BarChart, LineChart, axisClasses } from '@mui/x-charts'
import React from 'react'
import styled from 'styled-components';
import Button from '../Button';

export default function DataCenter({dataChart}) {

  console.log('data center', dataChart);

  const chartSetting = {
    yAxis: [
      {
        label: 'rainfall (mm)',
      },
    ],
    width: 1000,
    height: 500,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'rotate(-90deg) translate(0px, -20px)',
      },
    },
  };

  function obtenerClavesYEtiquetas(objeto) {
    const clavesYEtiquetas = [];
    
    for (const clave in objeto) {
      if (clave !== "_id" && clave !== "dataKey") {
        clavesYEtiquetas.push({ dataKey: clave, label: clave });
      }
    }
    
    return clavesYEtiquetas;
  }

  console.log(obtenerClavesYEtiquetas(dataChart[0]))
  console.log(dataChart.length)

  return (
    <Container>
        <BarChart
          dataset={dataChart}
          xAxis={[{ scaleType: 'band', dataKey: 'dataKey' }]}
          series={obtenerClavesYEtiquetas(dataChart[0])}
          {...chartSetting}
        />
    </Container>
  )
}

const Container = styled.div `
  overflow-x: scroll;
  max-height: 550px;
  @media only screen and (max-width: 1440px) {
    max-width: 750px;
  }
  @media only screen and (max-width: 1260px) {
    max-width: 900px;
  }
  @media only screen and (max-width: 900px) {
    max-width: 700px;
  }
  @media only screen and (max-width: 480px) {
    max-width: 350px;
  }
  @media only screen and (max-width: 380px) {
    max-width: 300px;
  }
`
