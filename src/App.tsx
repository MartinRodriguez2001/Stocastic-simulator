
import "reactflow/dist/style.css";
import { BrowserRouter as Router } from "react-router-dom";
import WorkSpace from "./screens/WorkSpace";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
        <WorkSpace></WorkSpace>
        <Toaster></Toaster>
    </Router>
  );
}

export default App;
