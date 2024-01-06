
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TweetOverview from './pages/TweetOverview';
import Card from './components/Card';
import Home from './pages/Home';
import Profile from './pages/Profile';


function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login />}></Route>
        <Route exact path='/login' element={<Login />}></Route>
        <Route exact path='/signup' element={<Signup />}></Route>
        <Route exact path='/tweets' element={<TweetOverview />}></Route>
        <Route exact path='/card' element={<Card />}></Route>
        <Route exact path='/home' element={<Home />}></Route>
        <Route exact path='/profile' element={<Profile />}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
