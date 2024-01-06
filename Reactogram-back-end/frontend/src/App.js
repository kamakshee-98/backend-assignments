import './App.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import PostOverview from './pages/PostOverview';
import Profile from './pages/Profile';


function App() {
  return (
    
     <BrowserRouter>
      <div className='app-bg'>
        <NavBar />
      </div>
      <Routes>
        <Route exact path='/' element={<Login />}></Route>
        <Route exact path='/login' element={<Login />}></Route>
        <Route exact path='/signup' element={<Signup />}></Route>
        <Route exact path='/posts' element={<PostOverview />}></Route>
        <Route exact path='/myprofile' element={<Profile />}></Route>
        
      </Routes>
     </BrowserRouter>
    
  );
}

export default App;
