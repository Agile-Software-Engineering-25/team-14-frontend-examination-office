import { Alert, Box, Snackbar, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import ExamsOverview from '@components/ExamsOverview/ExamsOverview.tsx';
import useApi from '@hooks/useApi';
import { useCallback, useEffect, useState } from 'react';
import type { Exam } from '@custom-types/exam';
import LanguageSelectorComponent from '@components/LanguageSelectorComponent/LanguageSelectorComponent';
import { isAxiosError } from 'axios';

const Exams = () => {
  const { t } = useTranslation();
  const { addExam, getExams, updateExam, deleteExam } = useApi();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState<'success' | 'danger'>(
    'success'
  );

  const refreshExams = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getExams();
      setExams(data);
    } catch (err) {
      console.error('Error refreshing exams:', err);
    } finally {
      setLoading(false);
    }
  }, [getExams]);

  const deleteExamFn = (exam: Exam) => {
    if (!exam.id) {
      setSnackbarMessage(t('pages.exams.table.deleteError.idMissing'));
      setSnackbarColor('danger');
      setSnackbarOpen(true);
      return;
    }

    deleteExam(exam.id)
      .then(() => {
        setSnackbarMessage(t('pages.exams.table.deleteSuccess'));
        setSnackbarColor('success');
        setSnackbarOpen(true);
        refreshExams();
      })
      .catch((err) => {
        console.error('Error deleting exam:', err);
        setSnackbarMessage(t('pages.exams.table.deleteError.unknown'));
        setSnackbarColor('danger');
        setSnackbarOpen(true);
      });
  };

  const addExamFn = (newExam: Exam) => {
    addExam(newExam)
      .then(() => {
        setSnackbarMessage(t('pages.exams.addExam.success'));
        setSnackbarColor('success');
        setSnackbarOpen(true);
        refreshExams();
        return true;
      })
      .catch((err: unknown) => {
        let message = t('pages.exams.addExam.error');
        if (isAxiosError(err)) {
          message = err.response?.data?.message || message;
          if (err.response?.data?.errors) {
            const errorDetails = Object.entries(err.response.data.errors)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(', ');
            message += ` - ${errorDetails}`;
          } else {
            message += ` - ${String(err)}`;
          }
        }
        setSnackbarMessage(message);
        setSnackbarColor('danger');
        setSnackbarOpen(true);
        return false;
      });
  };

  const editExamFn = (exam: Exam) => {
    if (!exam.id) {
      setSnackbarMessage(t('pages.exams.editExam.error.idMissing'));
      setSnackbarColor('danger');
      setSnackbarOpen(true);
      return;
    }

    updateExam(exam)
      .then(() => {
        setSnackbarMessage(t('pages.exams.editExam.success'));
        setSnackbarColor('success');
        setSnackbarOpen(true);
        refreshExams();
      })
      .catch((err: unknown) => {
        setSnackbarMessage(t('pages.exams.editExam.error.unknown'));
        setSnackbarColor('danger');
        setSnackbarOpen(true);
        console.error('Error updating exam:', err);
      });
  };

  useEffect(() => {
    refreshExams();
  }, [refreshExams]);

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
            onDelete={deleteExamFn}
            onAdd={addExamFn}
            onEdit={editExamFn}
          />
        )}
      </Box>

      {/* Language Selector */}
      <Box sx={{ alignSelf: 'flex-end' }}>
        <LanguageSelectorComponent />
      </Box>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ width: 'auto', maxWidth: '600px', padding: 0 }}
      >
        <Alert
          color={snackbarColor}
          variant="soft"
          sx={{ width: '100%', borderRadius: 1, m: 0, py: 1, px: 2 }}
        >
          <span style={{ textAlign: 'center', width: '100%' }}>
            {snackbarMessage}
          </span>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Exams;
