const soapRequest = require("easy-soap-request");
const xml2js = require("xml2js");

const { xmlBonusFull, soap } = require("../../helpers");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { tarjeta, sesion, carrito } = req.body;

    const xmlCompleto = xmlBonusFull({ tarjeta, sesion, carrito });

    //const urlNueva = `${process.env.NEXT_PUBLIC_API_URL}GetBonusRFPList`; // liga de pruebas
    const urlNueva = `${process.env.NEXT_PRODUCTION_API_URL}GetBonusRFPList`; // liga de produccion

    const Header = {
      "Content-Type": "text/xml;charset=UTF-8",
      soapAction: `${soap}GetBonusRFPList`,
    };

    (async () => {
      const { response } = await soapRequest({
        url: urlNueva,
        headers: Header,
        xml: xmlCompleto,
      });
      const { body } = response;

      xml2js.parseString(body, (err, result) => {
        if (err) {
          throw err;
        }

        const json = JSON.stringify(result, null, 4);
        //console.log(json);
        res.send(json);
      });
    })();
  }
}
