import logo from './logo.svg';
import './App.css';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './user/component/Header/Header';
import Footer from './user/component/Footer/Footer';
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
import NoticeInput from './admin/component/Noticeinput';
import Servicecenter from './user/page/Servicecenter/Servicecenter';
import ShopDetail from './user/page/ShopDetail/ShopDetail';
import Review from './user/page/Review/Review';
import Shoptable from './admin/section/Shoptable';
import Mainadmin from './admin/page/Mainadmin';
import Shopmanage from './admin/component/Shopmanage';
import Reviewinput from './user/page/Review/Reviewinput';
import Proposalmanage from './admin/page/Proposalmanage';
import Registershop from './admin/page/Registershop';
import NoticeTable from './admin/section/NoticeTable';
import NoticeManage from './admin/page/NoticeManage';
import NoticeDetail from './user/page/Notice/NoticeDetail';
import Newsfeed from './user/page/Newsfeed/Newsfeed';
import ResetPassword from './user/page/ResetPassword/ResetPassword';
import NoticeAdminDetail from './admin/page/NoticeAdminDetail';
import NoticeAdminEdit from './admin/page/NoticeAdminEdit';
import ProposalAdminDetail from './admin/page/ProposalAdminDetail';


function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path='/' element={<Mainpage />}></Route>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/Detail/:shopId" element={<ShopDetail />}></Route>
        <Route path="/Review/:shopId" element={<Review />}></Route>
        <Route path="/ReviewInput/:shopId" element={<Reviewinput />}></Route>

        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Notice" element={<Notice />}></Route>
        <Route path="/NoticeDetail" element={<NoticeDetail />}></Route>
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
        <Route path="/NoticeInput" element={<NoticeInput />}></Route>
        <Route path="/Shopmanage/:shopId" element={<Shopmanage />}></Route>
        <Route path="/Noticemanage" element={<NoticeManage />}></Route>
        <Route path="/Shoptable" element={<Shoptable />}></Route>
        <Route path="/Newsfeed" element={<Newsfeed />}></Route>
        <Route path="/ResetPassword/:email/:uuid" element={<ResetPassword />}></Route>
        <Route path="/noticeAdminDetail/:id" element={<NoticeAdminDetail />}></Route>
        <Route path="/noticeAdminEdit/:id" element={<NoticeAdminEdit />}></Route>
        <Route path="/proposalAdminDetail/:id" element={<ProposalAdminDetail />}></Route>
      </Routes>
    </BrowserRouter >
  );
}

export default App;
