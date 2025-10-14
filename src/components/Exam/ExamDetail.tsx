import {
  Box,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from '@mui/joy';
import type { Exam } from '@custom-types/exam';
import { useTranslation } from 'react-i18next';

interface ExamDetailProps {
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
  exam: Exam;
}

const ExamDetail = ({ isVisible, setVisible, exam }: ExamDetailProps) => {
  const { t } = useTranslation();

  return (
    <Modal open={isVisible} onClose={() => setVisible(false)}>
      <ModalDialog
        variant="outlined"
        sx={{ minWidth: '46%', maxWidth: '90%' }}
      >
        <ModalClose />
        <Typography level="h4">{t('pages.exams.examDetail.title')}</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.title')}:</Typography>
            <Typography level="body-sm">{exam?.title}</Typography>
          </Box>

          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.moduleCode')}:</Typography>
            <Typography level="body-sm">{exam?.moduleCode}</Typography>
          </Box>

          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.examDate')}:</Typography>
            <Typography level="body-sm">{exam?.examDate}</Typography>
          </Box>

          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.room')}:</Typography>
            <Typography level="body-sm">{exam?.room}</Typography>
          </Box>

          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.examType')}:</Typography>
            <Typography level="body-sm">{exam?.examType}</Typography>
          </Box>

          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.semester')}:</Typography>
            <Typography level="body-sm">{exam?.semester}</Typography>
          </Box>

          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.ects')}:</Typography>
            <Typography level="body-sm">{exam?.ects}</Typography>
          </Box>

          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.maxPoints')}:</Typography>
            <Typography level="body-sm">{exam?.maxPoints}</Typography>
          </Box>

          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.duration')}:</Typography>
            <Typography level="body-sm">{exam?.duration} minutes</Typography>
          </Box>

          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.attempt')}:</Typography>
            <Typography level="body-sm">{exam?.attemptNumber}</Typography>
          </Box>

          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.fileUploadRequired')}:</Typography>
            <Typography level="body-sm">{exam?.fileUploadRequired ? 'Yes' : 'No'}</Typography>
          </Box>

          <Box>
            <Typography level="title-sm">{t('pages.exams.addExam.fields.tools')}:</Typography>
            <Typography level="body-sm">
              {exam?.tools && exam.tools.length > 0 ? exam?.tools.join(', ') : 'None'}
            </Typography>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default ExamDetail;