import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="bg-white shadow rounded-lg p-6 text-center">
      <h1 className="text-4xl font-bold mb-4 text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
      <p className="text-lg mb-8 text-gray-600">
        A página que você está procurando não existe ou foi movida.
      </p>

      <div className="flex justify-center">
        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Voltar para dashboard
        </Link>
      </div>
    </div>
  );
}
