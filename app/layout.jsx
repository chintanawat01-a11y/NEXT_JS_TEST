
export const metadata = { title: "Final • Minimal", description: "Products demo" };

import "./globals.css";
import Navbar from "../COMPONENT/layout/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body>
        <Navbar />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
