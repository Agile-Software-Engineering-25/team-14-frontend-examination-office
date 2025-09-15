import { Box, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import ExamsOverview, {
  type Exam,
} from '@components/ExamsOverview/ExamsOverview.tsx';
import LanguageSelectorComponent from '@components/LanguageSelectorComponent/LanguageSelectorComponent';

const mockExams: Exam[] = [
  { id: '1', title: 'Klausur: Algorithmen und Datenstrukturen', modul: 'Algorithmen und Datenstrukturen', date: '2025-09-12', professor: 'Prof. Dr. Jorg Daubert', examType: 'Klausur' },
  { id: '2', title: 'WAB: Datenbanken und Datenmodellierung', modul: 'Datenbanken und Datenmodellierung', date: '2025-09-28', professor: 'Prof. Dr. Lamine Abdullah', examType: 'WAB' },
  { id: '3', title: 'Klausur: Betriebssysteme', modul: 'Betriebssysteme', date: '2025-09-24', professor: 'Prof. Dr. Eric Hutter', examType: 'Klausur' }, // fixed invalid date
  { id: '4', title: 'Klausur: Theoretische Informatik', modul: 'Theoretische Informatik', date: '2025-09-30', professor: 'Prof. Dr. Anna Keller', examType: 'Klausur' },
  { id: '5', title: 'WAB: Künstliche Intelligenz', modul: 'Künstliche Intelligenz', date: '2025-10-05', professor: 'Prof. Dr. Michael Schröder', examType: 'WAB' },
  { id: '6', title: 'Klausur: Rechnernetze', modul: 'Rechnernetze', date: '2025-10-10', professor: 'Prof. Dr. Tobias Lange', examType: 'Klausur' },
  { id: '7', title: 'WAB: Softwaretechnik', modul: 'Softwaretechnik', date: '2025-10-15', professor: 'Prof. Dr. Julia Hoffmann', examType: 'WAB' },
  { id: '8', title: 'Klausur: Mathematik III', modul: 'Mathematik III', date: '2025-10-18', professor: 'Prof. Dr. Stefan Weber', examType: 'Klausur' },
  { id: '9', title: 'WAB: IT-Sicherheit', modul: 'IT-Sicherheit', date: '2025-10-22', professor: 'Prof. Dr. Claudia Vogt', examType: 'WAB' },
  { id: '10', title: 'Klausur: Computergrafik', modul: 'Computergrafik', date: '2025-10-27', professor: 'Prof. Dr. Markus Hoffmann', examType: 'Klausur' },
  { id: '11', title: 'WAB: Webentwicklung', modul: 'Webentwicklung', date: '2025-11-02', professor: 'Prof. Dr. Katharina Müller', examType: 'WAB' },
  { id: '12', title: 'Klausur: Verteilte Systeme', modul: 'Verteilte Systeme', date: '2025-11-07', professor: 'Prof. Dr. Andreas Richter', examType: 'Klausur' },
  { id: '13', title: 'WAB: Maschinelles Lernen', modul: 'Maschinelles Lernen', date: '2025-11-12', professor: 'Prof. Dr. Laura Brandt', examType: 'WAB' },
];

const Exams = () => {
  const { t } = useTranslation();

  return (
      <Box
        sx={{
          maxWidth:"100vw",
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          p: 4,
          boxSizing: 'border-box',
          bgcolor: 'background.body',
        }}
      >
      {/* Page Title */}
      <Typography level="h2">{t('pages.exams.title', { defaultValue: 'Prüfungsübersicht' })}</Typography>

      {/* Exams Table */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <ExamsOverview
          exams={mockExams}
          onSelect={(exam) => {
            console.log('Selected exam', exam);
          }}
        />
      </Box>

      {/* Language Selector */}
      <Box sx={{ alignSelf: 'flex-end' }}>
        <LanguageSelectorComponent />
      </Box>
    </Box>
  );
};

export default Exams;
