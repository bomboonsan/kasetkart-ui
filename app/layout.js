// import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from '@/components/providers/AuthSessionProvider'

// const ibmPlexSansThai = IBM_Plex_Sans_Thai({
//   variable: "--font-ibm-plex-sans-thai",
//   subsets: ["thai", "latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700"],
// });

export const metadata = {
  title: "Kasetsart University Portfolio",
  description: "Portfolio system for Kasetsart University",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className="light">
      <body
        className={`antialiased font-sans`}
      >
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
