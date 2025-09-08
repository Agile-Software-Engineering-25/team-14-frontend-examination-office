import Weather from '@pages/Weather/Weather';
import Home from '@pages/Home/Home';
import { Route, Routes } from 'react-router';
import Exam from '@/pages/Exam/Exam';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/exam/add" element={<Exam />} />
    </Routes>
  );
};

export default RoutingComponent;
