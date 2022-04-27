import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Alerta from "../components/Alerta";
import axios from "axios";

const LoginCarga = ({ setAutenticado, setSesion }) => {
  const [error, setError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const login = useFormik({
    initialValues: {
      usuario: "",
      password: "",
      cadena: "0000000366",
      sucursal: "0000002591",
    },
    validationSchema: Yup.object({
      usuario: Yup.string().required("El usuario es obligatorio"),
      password: Yup.string().required("El password es obligatorio"),
      cadena: Yup.string().required("El codigo de cadena es obligatorio"),
      sucursal: Yup.string().required("El codigo de sucursal es obligatorio"),
    }),
    onSubmit: async (values) => {
      try {
        const url = "/api/login";
        const resultado = await axios.post(url, values);

        let respuesta =
          resultado.data["soap:Envelope"]["soap:Body"][0]["LoginResponse"][0][
            "LoginResult"
          ][0];

        if (respuesta["HuboError"][0] === "true") {
          setError(respuesta["HuboError"][0]);
          setMensaje(respuesta["MensajeError"][0]);
          return null;
        }

        setSesion(respuesta["Sesion"][0]);
        setAutenticado(true);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="grid ">
      <form
        className="mx-auto my-[7.5%] bg-white py-5 px-5 rounded-2xl shadow-xl"
        onSubmit={login.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center colorBase pb-5">Login</h1>

        <div className="grid grid-cols-2 py-1">
          <label className="text-xl">Usuario:</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            onChange={login.handleChange}
            onBlur={login.handleBlur}
            value={login.usuario}
            className="border-gray-400 border-2 rounded-md"
          />
        </div>
        {login.errors.usuario && login.touched.usuario && (
          <Alerta>{login.errors.usuario}</Alerta>
        )}
        <div className="grid grid-cols-2 py-1">
          <label className="text-xl">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={login.handleChange}
            onBlur={login.handleBlur}
            value={login.password}
            className="border-gray-400 border-2 rounded-md"
          />
        </div>
        {login.errors.password && login.touched.password && (
          <Alerta>{login.errors.password}</Alerta>
        )}
        {/* <div className="grid grid-cols-2 py-1">
          <label className="text-xl">Cadena:</label>
          <input
            type="text"
            id="cadena"
            name="cadena"
            onChange={login.handleChange}
            onBlur={login.handleBlur}
            value={login.cadena}
            className="border-gray-400 border-2 rounded-md"
          />
        </div>
        {login.errors.cadena && login.touched.cadena && (
          <Alerta>{login.errors.cadena}</Alerta>
        )}
        <div className="grid grid-cols-2 py-1">
          <label className="text-xl">Sucursal:</label>
          <input
            type="text"
            id="sucursal"
            name="sucursal"
            onChange={login.handleChange}
            onBlur={login.handleBlur}
            value={login.sucursal}
            className="border-gray-400 border-2 rounded-md"
          />
        </div>
        {login.errors.sucursal && login.touched.sucursal && (
          <Alerta>{login.errors.sucursal}</Alerta>
        )} */}

        <input
          type="submit"
          value="Iniciar Sesión"
          className="uppercase text-center bgBase text-white w-1/2 rounded-lg grid mx-auto my-3 py-1 cursor-pointer hover:bgBase-hover"
        />

        {error && <Alerta>{mensaje}</Alerta>}
      </form>
    </div>
  );
};

export default LoginCarga;
