import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import { Switch } from '@material-ui/core';
import NotFound from './components/NotFound';
import APIContext, {useAPIContext} from "./Contexts/APIContext";
import UserRegister from './components/User/Register';
import UserLogin from './components/User/UserLogin';
import Logout from './components/User/Logout';
import Studios from './components/Studios';
import UserProfile from './components/User/UserProfile';
import AddPaymentMethod from './components/User/Cards';
import CancelSubscription from './components/User/Subscriptions/CancelSubscription';
import ListSubscriptions from './components/User/Subscriptions/ListSubscriptions';
import Classes from './components/Classes';
import PaymentHistoryCard from './components/User/Subscriptions/PaymentHistoryCard';
import UpcomingSessionsCard from './components/Classes/UpcomingSessionsCard';

function App() {
  const layout = (
    <APIContext.Provider value={useAPIContext()}>
        <Layout />
    </APIContext.Provider>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={layout}>
            <Route path="/" element={<Home />} />
            <Route path="studios" element={<Studios />} />
            <Route path="subscriptions" element={<ListSubscriptions />} />
            <Route path="studios/:id/schedule" element={<Classes/>} />
            <Route path="*" element={<NotFound />}/>
            <Route path="register" element={<UserRegister />}/>
            <Route path="edit_profile" element={<UserProfile />}/>
            <Route path="profile" element={<UserProfile />}/>
            <Route path="login" element={<UserLogin />}/>
            <Route path="logout" element={<Logout />}/>
            <Route path="view_schedule" element={<UpcomingSessionsCard />}/>
            <Route path="add_payment_method" element={<AddPaymentMethod />}/>
            <Route path="payment_history" element={<PaymentHistoryCard />}/>
            <Route path="cancel_subscription" element={<CancelSubscription />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
