import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './component/Header/Header';
import Register from './page/Register/Register';
import Login from './page/Login/Login';
import Notice from './page/Notice/Notice';
import Search from './page/Search/Search';
import Benefit from './page/Benefit/Benefit';
import Mysector from './page/Mypage/Mysector';
import Myregion from './page/Mypage/Myregion';
import Mainpage from './page/Mainpage/Mainpage';
import Findpassword from './page/Findpassword/Findpassword';
import Myfavorite from './page/Mypage/Myfavorite';
import Myprofile from './page/Mypage/Myprofile';
import Mypage from './page/Mypage/Mypage';
import Entercorrection from './page/Mypage/Entercorrection';
import Quitdialog from './component/Dialog/Quitdialog';
import Servicecenter from './page/Servicecenter/Servicecenter';
import ShopDetail from './page/ShopDetail/ShopDetail';
import Review from './page/Review/Review';
import Shoptable from './admin/section/Shoptable';
import Mainadmin from './admin/page/Mainadmin';
import Reviewinput from './page/Review/Reviewinput';
import Proposalmanage from './admin/page/Proposalmanage';
import Registershop from './admin/page/Registershop';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Mainadmin />
      <Routes>
        <Route path='/' element={<Mainpage />}></Route>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/Detail/:shopId" element={<ShopDetail />}></Route>
        <Route path="/Review/:shopId" element={<Review />}></Route>
        <Route path="/ReviewInput/:shopId" element={<Reviewinput />}></Route>

        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Notice" element={<Notice />}></Route>
        <Route path="/Benefit" element={<Benefit />}></Route>
        <Route path="/Search" element={<Search />}></Route>
        <Route path="/Myregion" element={<Myregion />}></Route>
        <Route path="/Mysector" element={<Mysector />}></Route>
        <Route path="/Findpassword" element={<Findpassword />}></Route>
        <Route path="/Myfavorite" element={<Myfavorite />}></Route>
        <Route path="/Myprofile" element={<Myprofile />}></Route>
        <Route path="/Mypage" element={<Mypage />}></Route>
        <Route path="/Entercorrection" element={<Entercorrection />}></Route>
        <Route path="/Servicecenter" element={<Servicecenter />}></Route>
        <Route path="/Proposalmanage" element={<Proposalmanage />}></Route>
        <Route path="/Registershop" element={<Registershop />}></Route>
        <Route path="/Mainadmin" element={<Mainadmin />}></Route>
      </Routes>
    </BrowserRouter >
  );
}

export default App;
