import { Box, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import ExamsOverview from '@components/ExamsOverview/ExamsOverview.tsx';
import useApi from '@/hooks/useApi';
import { useEffect, useState } from 'react';
import type { Exam } from '@/@types/exam';
import LanguageSelectorComponent from '@components/LanguageSelectorComponent/LanguageSelectorComponent';

const Exams = () => {
  const { t } = useTranslation();
  const { getExams } = useApi();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExams()
      .then((data) => setExams(data))
      .catch((err) => console.error('Error fetching exams:', err))
      .finally(() => setLoading(false));
  }, [getExams]);

  return (
    <Box
      sx={{
        maxWidth: '100vw',
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
      <Typography level="h2">
        {t('pages.exams.title', { defaultValue: 'Prüfungsübersicht' })}
      </Typography>

      {/* Exams Table */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <Typography level="body-sm">Loading exams...</Typography>
        ) : (
          <ExamsOverview
            exams={exams}
            onSelect={(exam) => {
              console.log('Selected exam', exam);
            }}
          />
        )}
      </Box>

      {/* Language Selector */}
      <Box sx={{ alignSelf: 'flex-end' }}>
        <LanguageSelectorComponent />
      </Box>
    </Box>
  );
};

export default Exams;
