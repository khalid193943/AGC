import { Link } from 'react-router-dom';
export default function AdminStub() {
  return (
    <main className="min-h-screen bg-ink text-salt flex items-center">
      <div className="wrap">
        <p className="t-h2 max-w-[18ch]">L’espace d’administration n’est pas disponible dans l’aperçu.</p>
        <p className="t-body text-sea mt-4 max-w-[48ch]">Il fonctionne sur le site réel, connecté à Firebase. Son interface n’a pas été modifiée par la refonte.</p>
        <Link to="/" className="btn btn-saffron mt-8">Retour à l’accueil</Link>
      </div>
    </main>
  );
}
