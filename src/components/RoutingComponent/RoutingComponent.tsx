import Weather from '@pages/Weather/Weather';
import Home from '@pages/Home/Home';
import { Route, Routes } from 'react-router';
import Exams from '@pages/Exams/ExamsOverview.tsx';
import Submissions from '@/pages/Submissions/Submissions';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/exams" element={<Exams />} />
      <Route path="/submissions/:examId?" element={<Submissions />} />
    </Routes>
  );
};

export default RoutingComponent;
