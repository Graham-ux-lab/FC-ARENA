import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'FC ARENA',
  description: 'Competitive FC Starts Here',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}