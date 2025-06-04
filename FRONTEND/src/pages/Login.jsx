import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Login() {
  const { login } = useAuth();
  // Estado local para el email ingresado
  const [email, setEmail] = useState("");
  // Estado local para la contraseña ingresada
  const [password, setPassword] = useState("");
  // Estado para controlar si se está procesando la autenticación (loading)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Inicio de sesión exitoso");
      navigate("/");
    } catch (error) {
      toast.error(`❌ ${error.message || "Error de autenticación"}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EBBDCA] px-4 py-6 sm:px-8">
      {/* Contenedor centrado */}
      <div className="w-full max-w-md mx-auto">
        {/* Botón para volver a la página anterior */}
        <button
          onClick={() => navigate(-1)} // Navega hacia atrás en el historial
          className="text-white text-lg mb-4 flex items-center gap-2"
        >
          <span className="text-2xl">&laquo;</span> Back
        </button>

        {/* Caja principal del formulario */}
        <div className="bg-[#FF7BAB] border border-black rounded-sm p-6 sm:p-8 shadow-md">
          {/* Título del formulario */}
          <h2 className="text-white text-2xl font-semibold text-center mb-6">
            Sign in
          </h2>

          {/* Formulario de login */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate // Desactiva validación nativa del navegador
          >
            {/* Campo email */}
            <div>
              <label htmlFor="email" className="text-white block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border-2 border-black rounded-none focus:outline-none bg-[#FFFFFF]"
              />
            </div>

            {/* Campo password */}
            <div>
              <label htmlFor="password" className="text-white block mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border-2 border-black rounded-none focus:outline-none bg-[#FFFFFF]"
              />
            </div>

            {/* Botón para enviar formulario */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-[#FF4F78] text-white py-2 rounded-full border border-black hover:bg-[#D6406D]"
            >
              {/* Cambia texto según si está cargando o no */}
              {loading ? "Loading..." : "Get started"}
            </button>
          </form>

          {/* Texto para redirigir a registro si no tiene cuenta */}
          <p className="text-white text-center mt-4 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="underline cursor-pointer"
              role="button"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
