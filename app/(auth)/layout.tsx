export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="w-full fixed  z-50 bg-background/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-center mt-10">AI Chatbot</h1>
      </header>
      {children}
    </div>
  );
}
