import { Route, Routes } from 'react-router';
import Exams from '@pages/Exams/ExamsOverview.tsx';
import Certificates from '@pages/Certificates/CertificateOverview.tsx';
import Submissions from '@pages/Submissions/Submissions.tsx';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/exams" element={<Exams />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/submissions/:examId?" element={<Submissions />} />
    </Routes>
  );
};

export default RoutingComponent;
