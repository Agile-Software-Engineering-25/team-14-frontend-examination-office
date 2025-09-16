import Weather from '@pages/Weather/Weather';
import JoyColorShowcase from '@/pages/JoyColorShowcase/JoyColorShowcase';
import Home from '@pages/Home/Home';
import { Route, Routes } from 'react-router';
import Exam from '@/pages/Exam/Exam';
import UserDataShowcase from '@/pages/UserDataShowcase/UserDataShowcase';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/exam/add" element={<Exam />} />
      <Route path="/user" element={<UserDataShowcase />} />
      <Route path="/colors" element={<JoyColorShowcase />} />
    </Routes>
  );
};

export default RoutingComponent;
