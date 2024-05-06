import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Header from './component/Header/Header';
import Register from './page/Register/Register';
import Login from './page/Login/Login';
import Notice from './page/Notice/Notice';
import Search from './page/Search/Search';
import Benefit from './page/Benefit/Benefit';
import Mysector from './page/Mypage/Mysector';
import Myregion from './page/Mypage/Myregion';
import Mainpage from './page/Mainpage/Mainpage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Mainpage />
      <Routes>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Notice" element={<Notice />}></Route>
        <Route path="/Benefit" element={<Benefit />}></Route>
        <Route path="/Search" element={<Search />}></Route>
        <Route path="/Myregion" element={<Myregion />}></Route>
        <Route path="/Mysector" element={<Mysector />}></Route>
      </Routes>
    </BrowserRouter>
      
  );
}

export default App;
