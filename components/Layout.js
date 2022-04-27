import Image from "next/image";
import Navegacion from "./Navegacion";

const Layout = ({ children }) => {
  return (
    <>
      <header>
        <Navegacion />
      </header>
      <div className="absolute w-full h-auto flex justify-center -z-10 opacity-30">
        <div>
          <Image
            src={"/cdso.png"}
            alt="Imagen de fondo"
            width={800}
            height={800}
          />
        </div>
      </div>

      {children}
    </>
  );
};

export default Layout;
