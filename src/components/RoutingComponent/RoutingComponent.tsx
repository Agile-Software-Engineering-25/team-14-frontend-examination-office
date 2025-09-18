import Weather from '@pages/Weather/Weather';
import Home from '@pages/Home/Home';
import { Route, Routes } from 'react-router';
import Exams from '@pages/Exams/ExamsOverview.tsx';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/exams" element={<Exams />} />
    </Routes>
  );
};

export default RoutingComponent;
