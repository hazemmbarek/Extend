import './signup.css';

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="signup-layout">
      {children}
    </div>
  );
} 