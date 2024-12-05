import "./globals.css";
import { Providers } from "./providers";
import "./styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body>
        <Providers>
          {/* Schneeflocken-Container */}
          <div className="snowflakes" aria-hidden="true">
            {/* Schneeflocken */}
            <div className="snowflake">❅</div>
            <div className="snowflake">❆</div>
            <div className="snowflake">❅</div>
            <div className="snowflake">❆</div>
            <div className="snowflake">❅</div>
            <div className="snowflake">❆</div>
            <div className="snowflake">❅</div>
            <div className="snowflake">❆</div>
            <div className="snowflake">❅</div>
            <div className="snowflake">❆</div>
            <div className="snowflake">❅</div>
            <div className="snowflake">❆</div>
          </div>

          {children}
        </Providers>
      </body>
    </html>
  );
}