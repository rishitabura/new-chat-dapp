import "../styles/globals.css";

//INTERNAL IMPORT
import { ChatAppProvider } from "../Context/ChatAppContext";
import { NavBar } from "../Components/index";
// import { Sidebar } from "../Components/Sidebar/Sidebar"; 

const MyApp = ({ Component, pageProps }) => (
  <div>
    <ChatAppProvider>
      {/* <Sidebar/> */}
      <NavBar />
      <Component {...pageProps} />
    </ChatAppProvider>
  </div>
);

export default MyApp;
