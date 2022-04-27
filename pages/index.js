import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";
import Layout from "../components/Layout";
import Login from "../components/Login";
import Spinner from "../components/Spinner";
import Alerta from "../components/Alerta";
import Swal from "sweetalert2";

const VerificarCarga = () => {
  const [autenticado, setAutenticado] = useState(false);

  const [datos, setDatos] = useState([]);
  const [error, setError] = useState("false");
  const [mensaje, setMensaje] = useState("");
  const [promociones, setPromociones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [sesion, setSesion] = useState("");
  const [tarjeta, setTarjeta] = useState("");

  /*Funcion para leer excel*/
  const handleChange = (e) => {
    //Resetear el state
    setDatos([]);
    setError("false");
    setMensaje("");
    setPromociones([]);
    let reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);

    reader.onload = (e) => {
      const conf = e.target.result;
      const excel = XLSX.read(conf, { type: "array" });
      const wsname = excel.SheetNames[0]; //Hoja1
      const ws = excel.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }); //agregar valores a json
      setDatos(data);
    };
  };

  // funcion para seleccionar la membresia a usar
  const handleTarjeta = (membresia) => {
    setTarjeta(membresia);
  };

  // fucion para obtener los beneficios
  const handleBeneficios = async () => {
    if (Object.keys(datos).length === 0) {
      Swal.fire({
        title: "Agregue el archivo con la información a verificar",
        icon: "info",
      });
      return null;
    }

    if (tarjeta === "") {
      Swal.fire({
        title: "Ingrese Tarjeta de CDSO",
        icon: "info",
      });
      return null;
    }

    try {
      setCargando(true);
      const url = "/api/cargaPromo";
      const respuesta = await axios.post(url, {
        carrito: datos,
        tarjeta,
        sesion,
      });

      let resultado =
        respuesta.data["soap:Envelope"]["soap:Body"][0][
          "GetBonusRFPListResponse"
        ][0]["GetBonusRFPListResult"][0]["ResponseBonusRFPList"];

      setError(resultado[0]["HuboError"][0]);

      if (error === "true") {
        console.log("error");
        setMensaje(resultado[0]["MensajeError"][0]);
        setCargando(false);
        return null;
      }

      setMensaje("");
      setPromociones(resultado);
      setCargando(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      {!autenticado ? (
        <Login setAutenticado={setAutenticado} setSesion={setSesion} />
      ) : (
        <main className="bg-white pt-5">
          <div className="flex justify-evenly mt-5">
            <div>
              <label className="font-bold mr-2 text-2xl">Archivo:</label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleChange}
              />
            </div>
            <select
              onChange={(e) => handleTarjeta(e.target.value)}
              className="border-gray-400 border-2 rounded-lg "
            >
              <option value="">---Seleccione la membresia---</option>
              <option value="2605000900862">2605000900862 - Sanofi</option>
              <option value="9981214161491">9981214161491 - CDSO</option>
            </select>
            <button
              type="button"
              onClick={handleBeneficios}
              className="bgBase hover:bgBase-hover uppercase text-white font-bold text-3xl rounded-lg px-4"
            >
              Buscar Beneficios
            </button>
            {cargando && (
              <div className="bg-white">
                <Spinner />
              </div>
            )}
          </div>

          {error !== "false" && <Alerta>{mensaje}</Alerta>}
          <table className="w-full shadow-xl bg-white mt-4">
            <thead>
              <tr className="border-b-gray-500 border-b-2 grid grid-cols-11">
                <th>SKU</th>
                <th>PAGADOS</th>
                <th>FECHA INICIO</th>
                <th>FECHA FIN</th>
                <th>COMPRAS X</th>
                <th>GRATIS Y</th>
                <th>PRECIO FIJO</th>
                <th>MONTO DESCUENTO</th>
                <th>PORCENTAJE</th>
                <th>PRESENTACION</th>
                <th>TIPO PROMOCION</th>
              </tr>
            </thead>
            {Object.keys(promociones).length === 0
              ? datos.map((data) => (
                  <tbody key={data[0] + data[8]} className="text-center">
                    <tr className="grid grid-cols-11 border-b-2 border-gray-400">
                      <td>{data[0]}</td> {/*SKU */}
                      <td>{data[8] !== "0" ? data[8] : "1"}</td>
                      {/*pagados */}
                      <td>{data[4]}</td> {/*fecha inicio */}
                      <td>{data[5]}</td> {/*fecha fin */}
                      <td>{data[8]}</td> {/*compras X */}
                      <td>{data[9]}</td> {/*gratis Y */}
                      <td>{data[11]}</td> {/*Preciofijo */}
                      <td>{data[12]}</td> {/*monto descuento */}
                      <td>{data[10]}</td> {/*porcentaje*/}
                      <td>{data[1]}</td> {/*presentacion */}
                      <td>{data[7]}</td> {/*tipo promocion */}
                    </tr>
                  </tbody>
                ))
              : promociones.map((promo) => (
                  <tbody
                    key={promo.Sku + promo.PiezasPorComprar}
                    className="text-center"
                  >
                    <tr className="grid grid-cols-11 border-b-2 border-gray-400 font-bold">
                      {/* <td>{promo.Sku}</td> */}
                      {datos.map(
                        (data) =>
                          data[0].toString() === promo.Sku.toString() && (
                            <>
                              <td>{promo.Sku}</td>
                              <td>{promo.PiezasPorComprar[0]}</td>
                              <td>{promo["Promocion"][0]["FechaInicio"]}</td>
                              <td>{promo["Promocion"][0]["FechaFin"]}</td>
                              <td>{promo["Promocion"][0]["CompraX"]}</td>
                              <td
                                className={`${
                                  parseFloat(data[9]) ===
                                  parseFloat(promo.PiezasGratis)
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500"
                                }`}
                              >
                                <p>Respuesta: {promo.PiezasGratis}</p>
                                <p>Catálogo: {data[9]}</p>
                              </td>
                              <td
                                className={`${
                                  parseFloat(data[11]) ===
                                  parseFloat(promo.PrecioFijo)
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500"
                                }`}
                              >
                                <p>Respuesta: {promo.PrecioFijo} </p>
                                <p>Catálogo: {data[11]}</p>
                              </td>{" "}
                              {/*Preciofijo */}
                              <td
                                className={`${
                                  parseFloat(data[12]) ===
                                  parseFloat(promo.MontoDescuento)
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500"
                                }`}
                              >
                                <p>
                                  Respuesta: {parseFloat(promo.MontoDescuento)}
                                </p>
                                <p>Catálogo: {data[12]}</p>
                              </td>
                              <td
                                className={`${
                                  parseFloat(data[10]) ===
                                  parseFloat(promo.PorcentajeDescuento)
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500"
                                }`}
                              >
                                <p>Respuesta: {promo.PorcentajeDescuento}</p>
                                <p>Catálogo: {data[10]}</p>
                              </td>
                              <td>{promo["Promocion"][0]["Presentacion"]}</td>
                              <td>
                                <p
                                  className={`${error === "true" && "hidden"}`}
                                >
                                  {promo["Promocion"][0]["TipoPromocion"]}
                                </p>
                                <p
                                  className={`${
                                    error === "true" && "text-red"
                                  }`}
                                >
                                  {promo.MensajeError}
                                </p>
                              </td>
                            </>
                          )
                      )}
                    </tr>
                  </tbody>
                ))}
            <td className="h-4"></td>
          </table>

          {}
        </main>
      )}
    </Layout>
  );
};

export default VerificarCarga;
