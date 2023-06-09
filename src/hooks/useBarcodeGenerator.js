import { useEffect, useState } from 'react';
import JsBarcode from 'jsbarcode';

const useBarcodeGenerator = (initialBarcode = '') => {

  const [barcodeValue, setBarcodeValue] = useState(initialBarcode);
  const [barcodeDataURL, setBarcodeDataURL] = useState('');

  useEffect(() => {
    console.log("NEW BARCODE", barcodeValue)
    generateBarcode();
  }, [barcodeValue]);

  const generateBarcode = () => {
    let barcodeNumber = barcodeValue;
    if (!barcodeNumber) {
      const randomNumber = Math.floor(Math.random() * 1000000000); // Genera un número aleatorio de 9 dígitos
      barcodeNumber = randomNumber.toString().padStart(9, '0'); // Rellena con ceros a la izquierda si es necesario
    }

    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, barcodeNumber, {
        format: 'CODE128', // Puedes cambiar el formato del código de barras según tus necesidades
      });
      setBarcodeValue(barcodeNumber);
      setBarcodeDataURL(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('Error al generar el código de barras:', error);
    }
  };

  return { barcodeValue, barcodeDataURL, generateBarcode };
};

export default useBarcodeGenerator;