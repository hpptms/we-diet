import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f5f5f7" }}>
    <Header />
    <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div style={{ textAlign: "center", maxWidth: "800px", width: "100%" }}>
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

export default DashboardLayout;
