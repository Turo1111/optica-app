import { useEffect, useState } from 'react';
import JsBarcode from 'jsbarcode';

const useBarcodeGenerator = (barcodeNumber) => {
  const [barcodeDataURL, setBarcodeDataURL] = useState('');

  useEffect(() => {
    generateBarcode();
  }, [barcodeNumber]);

  const generateBarcode = () => {
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, barcodeNumber, {
        format: 'CODE128',
      });
      setBarcodeDataURL(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('Error al generar el código de barras:', error);
    }
  };

  const downloadBarcodeImage = () => {
    const link = document.createElement('a');
    link.href = barcodeDataURL;
    link.download = 'barcode.png';
    link.click();
  };

  return { barcodeDataURL, downloadBarcodeImage };
};

export default useBarcodeGenerator;
