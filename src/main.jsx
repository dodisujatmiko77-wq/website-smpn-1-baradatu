import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

class AppErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state={error:null}; }
  static getDerivedStateFromError(error){ return {error}; }
  render(){
    if(this.state.error){
      return React.createElement("div", {style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:"24px",fontFamily:"Inter,system-ui,sans-serif",background:"#f8fafc",color:"#0f172a"}},
        React.createElement("div", {style:{maxWidth:"620px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"18px",padding:"28px",boxShadow:"0 18px 50px rgba(15,23,42,.08)"}},
          React.createElement("h1", {style:{margin:"0 0 8px",fontSize:"22px"}}, "Website sedang mengalami kendala pemuatan"),
          React.createElement("p", {style:{margin:"0 0 18px",color:"#64748b",lineHeight:1.6}}, "Silakan muat ulang halaman. Jika masalah tetap muncul, periksa koneksi aplikasi dan dependency project."),
          React.createElement("button", {onClick:()=>window.location.reload(), style:{border:0,borderRadius:"10px",padding:"11px 16px",fontWeight:700,cursor:"pointer",background:"#0f4c81",color:"#fff"}}, "Muat Ulang")
        )
      );
    }
    return this.props.children;
  }
}
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/responsive.css";
import "./styles/homepage.css";
import "./styles/additions.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
