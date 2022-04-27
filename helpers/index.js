export const soap = "http://tempuri.org/";

const cabeceraXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>`;

const pieXml = `</soap:Body>
  </soap:Envelope>`;

export const xmlLoginCarga = (datos) => {
  const xml = `<Login xmlns="http://tempuri.org/">
    <Usuario>${datos.usuario}</Usuario>
    <Password>${datos.password}</Password>
    <CodigoCadena>${datos.cadena}</CodigoCadena>
    <CodigoSucursal>${datos.sucursal}</CodigoSucursal>
  </Login>`;

  return cabeceraXml + xml + pieXml;
};

export const xmlBonusFull = (datos) => {
  const { carrito } = datos;

  let producto = carrito.map(
    (data) =>
      `<BonusProductList>
      <Sku>${data[0]}</Sku>
      <Piezas>${data[8] !== "0" ? data[8] : "1"}</Piezas>
    </BonusProductList>`
  );

  const xml = `<GetBonusRFPList xmlns="http://tempuri.org/">
    <Sesion>${datos.sesion}</Sesion>
    <NoTarjeta>${datos.tarjeta}</NoTarjeta>
    <Productos>
    ${producto}
  </Productos>
  </GetBonusRFPList>`;

  //console.log(xml);

  return cabeceraXml + xml + pieXml;
};
