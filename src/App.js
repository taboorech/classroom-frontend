import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./containers/Auth/Auth";
import Classes from "./containers/Classes/Classes";
import ClassInfo from "./containers/ClassInfo/ClassInfo";
import Layout from "./hoc/Layout/Layout";

function App() {

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if(!auth.isAuth) {
      navigate('/auth');
    }
  }, [auth, navigate]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Classes/>}></Route>
        <Route path="/classes/:id" element={<ClassInfo />}></Route>
        <Route path="/auth" element={<Auth/>}></Route>
      </Routes>
    </Layout>
  );
}

export default App;
