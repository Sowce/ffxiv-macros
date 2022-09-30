import { Route, Routes } from "react-router-dom";
import Expansion from "./routes/Expansion";
// import Home from "./routes/Home";
import Macro from "./routes/Macro";
import RaidList from "./routes/RaidList";

function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/" element={<Macro />} />
          <Route path=":expansionID" element={<Expansion />} />
          <Route path=":expansionID/raids" element={<RaidList />} />
          <Route path="macro" element={<Macro />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
