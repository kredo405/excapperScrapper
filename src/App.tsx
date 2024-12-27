import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Match from "./pages/Match";
import { Overview } from "./components/Overview";
import { Statistics } from "./components/Statistics";
import { Predictions } from "./components/Predictions";

function App() {
  return (
    <>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:sport" element={<Home />} />
          <Route path="/match/:link" element={<Match />}>
            <Route index element={<Overview />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="predictions" element={<Predictions />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
