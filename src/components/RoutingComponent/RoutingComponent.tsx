import Weather from '@pages/Weather/Weather';
import JoyColorShowcase from '@/pages/JoyColorShowcase/JoyColorShowcase';
import Home from '@pages/Home/Home';
import { Route, Routes } from 'react-router';
import UserDataShowcase from '@/pages/UserDataShowcase/UserDataShowcase';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/user" element={<UserDataShowcase />} />
      <Route path="/colors" element={<JoyColorShowcase />} />
    </Routes>
  );
};

export default RoutingComponent;
