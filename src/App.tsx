import { Toaster } from "react-hot-toast";
import { EditorProvider, TypingProvider } from "./context";
import "./styles/index.css";
import { Frame } from "./utils/Frame";
import { Layout } from "./utils/Layout";

function App() {
  return (
    <EditorProvider>
      <TypingProvider>
          <Toaster position="bottom-right" />
          <Frame />
          <Layout />
      </TypingProvider>
    </EditorProvider>
  );
}

export default App;
