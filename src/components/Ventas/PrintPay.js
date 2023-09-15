import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Table from '../Table';
import Button from '../Button';
import Loading from '../Loading';
import { useDate } from '@/hooks/useDate';
import apiClient from '@/utils/client';
import Confirm from '../Confirm';
import { useAppDispatch } from '@/redux/hook';
import { setAlert } from '@/redux/alertSlice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PrintSale({
  cliente,
  onClose,
  token,
}) {
  const [lineaVenta, setLineaVenta] = useState(carrito);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const dispatch = useAppDispatch();
  const { date: fechaDate } = useDate();

  const generatePdf = async () => {
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    for (let index = 0; index < [...Array(totalPartes)].length; index++) {
      const element = document.getElementById(`print-${index}`);
      await html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = pdfHeight;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      });
      if (index < [...Array(totalPartes)].length-1) {
        pdf.addPage()
      }
    }
    const pdfName = `venta-${cliente}-${fechaDate}.pdf`;
    pdf.save(pdfName);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
        <div>
          <Tag>CLIENTE : {cliente}</Tag>
          <Tag>FECHA : {fechaDate}</Tag>
          <Tag>Total : {fechaDate}</Tag>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button text={'Imprimir'} onClick={() => setOpenConfirm(true)} />
          <Button text={'Aceptar'} onClick={onClose} />
        </div>

      {openConfirm && (
        <Confirm
          confirmAction={generatePdf}
          handleClose={() => setOpenConfirm(false)}
          loading={loading}
          open={openConfirm}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  overflow-y: scroll;
`;

const WrapperPrint = styled.div`
  overflow: scroll;
  max-height: 200px;
`;

const ContainerPrint = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 210mm; /* Tamaño A4 */
  height: 297mm;
  margin: 0 auto;
  padding: 10mm; /* Márgenes de 10mm */
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 16px; /* Tamaño de fuente fijo */
  /* Otros estilos fijos aquí */
`;

const columns = [
  { label: 'Producto', field: 'descripcion', width: '50%' },
  { label: 'Cantidad', field: 'cantidad', width: '20%', align: 'center' },
  { label: 'Total', field: 'total', width: '30%', align: 'center', price: true },
];

const Tag = styled.h5`
  font-size: 16px;
  padding: 0 15px;
  font-weight: 500;
  margin: 10px 0;
  color: ${process.env.TEXT_COLOR};
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
