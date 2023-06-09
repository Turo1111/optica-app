'use client'
import useBarcodeGenerator from '@/hooks/useBarcodeGenerator';
import React from 'react'

export default function Clientes() {
    const { barcodeValue, barcodeDataURL, generateBarcode } = useBarcodeGenerator('21321321');

    const handleGenerateBarcode = () => {
      generateBarcode(); // Genera un código de barras aleatorio
    };

  return (
    <div>
      <p>Código de barras: {barcodeValue}</p>
      <img src={barcodeDataURL} alt="Barcode" />
      <button onClick={handleGenerateBarcode}>Generar Código de Barras</button>
    </div>
  );
}
