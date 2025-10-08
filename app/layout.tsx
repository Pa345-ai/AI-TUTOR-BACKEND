export const metadata = {
  title: "AI Tutor",
  description: "AI Tutoring App powered by Supabase & OpenAI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
