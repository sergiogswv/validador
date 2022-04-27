import Image from "next/image";
import Link from "next/link";

const Navegacion = () => {
  return (
    <nav className="flex justify-between items-center text-white text-4xl bg-[#5e8420] text-left ali ">
      <div className="flex justify-start items-center">
        <Link href={"/panel"} passHref>
          <a>
            <Image
              src={"/cdso_sf.png"}
              alt="Imagen de fondo"
              width={100}
              height={100}
            />
          </a>
        </Link>
        <h1>Circulo de la Salud - Oro</h1>
      </div>
    </nav>
  );
};

export default Navegacion;
