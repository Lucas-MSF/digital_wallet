export function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Minha Carteira. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
