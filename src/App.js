import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './user/component/Header/Header';
import Register from './user/page/Register/Register';
import Login from './user/page/Login/Login';
import Notice from './user/page/Notice/Notice';
import Search from './user/page/Search/Search';
import Benefit from './user/page/Benefit/Benefit';
import Mysector from './user/page/Mypage/Mysector';
import Myregion from './user/page/Mypage/Myregion';
import Mainpage from './user/page/Mainpage/Mainpage';
import Findpassword from './user/page/Findpassword/Findpassword';
import Myfavorite from './user/page/Mypage/Myfavorite';
import Myprofile from './user/page/Mypage/Myprofile';
import Mypage from './user/page/Mypage/Mypage';
import Entercorrection from './user/page/Mypage/Entercorrection';
import Quitdialog from './user/component/Dialog/Quitdialog';
import Servicecenter from './user/page/Servicecenter/Servicecenter';
import ShopDetail from './user/page/ShopDetail/ShopDetail';
import Review from './user/page/Review/Review';
import Shoptable from './admin/section/Shoptable';
import Mainadmin from './admin/page/Mainadmin';
import Reviewinput from './user/page/Review/Reviewinput';
import Proposalmanage from './admin/page/Proposalmanage';
import Registershop from './admin/page/Registershop';

function App() {
  return (
    <BrowserRouter>
      <Header />
      {/* <Registershop /> */}
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
