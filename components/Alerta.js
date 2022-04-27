const Alerta = ({ children }) => {
  return (
    <div className="grid mx-auto py-3 bg-gradient-to-tr from-red-700 to-red-500 rounded w-10/12 text-center text-white uppercase ">
      <p>{children}</p>
    </div>
  );
};

export default Alerta;
