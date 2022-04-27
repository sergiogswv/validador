const soapRequest = require("easy-soap-request");
const xml2js = require("xml2js");

const { xmlLoginCarga, soap } = require("../../helpers");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { usuario, password, cadena, sucursal } = req.body;

    const xmlCompleto = xmlLoginCarga({ usuario, password, cadena, sucursal });

    const urlNueva = `${process.env.NEXT_PRODUCTION_API_URL}Login`; // url de produccion
    //const urlNueva = `${process.env.NEXT_PUBLIC_API_URL}Login`; // url de pruebas

    //console.log(urlNueva);
    const Header = {
      "Content-Type": "text/xml;charset=UTF-8",
      soapAction: `${soap}Login`,
    };

    // usage of module
    (async () => {
      const { response } = await soapRequest({
        url: urlNueva,
        headers: Header,
        xml: xmlCompleto,
      }); // Optional timeout parameter(milliseconds)
      const { body } = response;

      xml2js.parseString(body, (err, result) => {
        if (err) {
          throw err;
        }

        // `result` is a JavaScript object
        // convert it to a JSON string
        const json = JSON.stringify(result, null, 4);

        // log JSON string
        res.send(json);
      });
    })();
  }
}
