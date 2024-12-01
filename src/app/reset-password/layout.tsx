import '../signin/signin.css';

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="signin-layout">
      {children}
    </div>
  );
} 