import {BrowserRouter as Router , Route , Routes} from 'react-router-dom';

import LoginPage from '../LoginPage';
import AdminPage from '../AdminPage';
import UserPage from '../UserPage';

function Main() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/adminPage' element={<AdminPage />} />
        <Route path='/userPage' element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default Main;
