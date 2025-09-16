import Weather from '@pages/Weather/Weather';
import JoyColorShowcase from '@/pages/JoyColorShowcase/JoyColorShowcase';
import Home from '@pages/Home/Home';
import { Route, Routes } from 'react-router';
<<<<<<< HEAD
import Exam from '@/pages/Exam/Exam';
=======
import UserDataShowcase from '@/pages/UserDataShowcase/UserDataShowcase';
>>>>>>> b0dd09f6fc12e3ffc04404f58e0eed20f5bb97ff

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather" element={<Weather />} />
<<<<<<< HEAD
      <Route path="/exam/add" element={<Exam />} />
=======
      <Route path="/user" element={<UserDataShowcase />} />
      <Route path="/colors" element={<JoyColorShowcase />} />
>>>>>>> b0dd09f6fc12e3ffc04404f58e0eed20f5bb97ff
    </Routes>
  );
};

export default RoutingComponent;
