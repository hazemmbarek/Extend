import './signin.css';

export default function SignInLayout({
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