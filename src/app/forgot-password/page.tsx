import Link from 'next/link';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <div className="signin-layout">
      <Link href="/" className="back-to-home">
        <i className="bi bi-arrow-left"></i>
        Retour à l'accueil
      </Link>

      <ForgotPasswordForm />
    </div>
  );
} 