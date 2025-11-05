import { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0a0a0f", color: "white" }}>
        {children}
      </body>
    </html>
  );
}
