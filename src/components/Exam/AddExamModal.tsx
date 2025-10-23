import {
  Box,
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  Input,
  Select,
  Option,
  FormControl,
  FormLabel,
  Checkbox,
  Chip,
} from '@mui/joy';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AddExamModal = ({
  open,
  setOpen,
  onAdd = () => {},
}: {
  open: boolean;
  setOpen: CallableFunction;
  onAdd?: CallableFunction;
}) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [examDate, setExamDate] = useState('');
  const [room, setRoom] = useState('');
  const [examType, setExamType] = useState('KLAUSUR');
  const [semester, setSemester] = useState('');
  const [ects, setEcts] = useState(5);
  const [maxPoints, setMaxPoints] = useState(100);
  const [duration, setDuration] = useState(90);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [fileUploadRequired, setFileUploadRequired] = useState(false);
  const [tools, setTools] = useState<string[]>([]);
  const [currentTool, setCurrentTool] = useState('');

  const handleAddTool = () => {
    if (currentTool.trim() && !tools.includes(currentTool.trim())) {
      setTools([...tools, currentTool.trim()]);
      setCurrentTool('');
    }
  };

  const handleRemoveTool = (tool: string) => {
    setTools(tools.filter((t) => t !== tool));
  };

  const resetForm = () => {
    setTitle('');
    setModuleCode('');
    setExamDate('');
    setRoom('');
    setExamType('KLAUSUR');
    setSemester('');
    setEcts(5);
    setMaxPoints(100);
    setDuration(90);
    setAttemptNumber(1);
    setFileUploadRequired(false);
    setTools([]);
    setCurrentTool('');
  };

  const handleSubmit = async () => {
    const newExam = {
      title,
      moduleCode,
      examDate,
      room,
      examType,
      semester,
      ects,
      maxPoints,
      duration,
      attemptNumber,
      fileUploadRequired,
      tools,
    };

    if (onAdd(newExam)) {
      resetForm();
      setOpen(false);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        variant="outlined"
        sx={{
          minWidth: '40%',
          maxWidth: '40%',
          maxHeight: '80vh',
          overflow: 'auto',
          p: 2,
        }}
      >
        <ModalClose />
        <Typography level="h4">{t('pages.exams.addExam.title')}</Typography>

        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.2,
            mt: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <FormControl sx={{ flex: 1, minWidth: 180 }}>
              <FormLabel>{t('pages.exams.addExam.fields.title')}</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl sx={{ flex: 1, minWidth: 150 }}>
              <FormLabel>
                {t('pages.exams.addExam.fields.moduleCode')}
              </FormLabel>
              <Input
                value={moduleCode}
                onChange={(e) => setModuleCode(e.target.value)}
              />
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <FormControl sx={{ flex: 1, minWidth: 180 }}>
              <FormLabel>{t('pages.exams.addExam.fields.examDate')}</FormLabel>
              <Input
                type="datetime-local"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ flex: 1, minWidth: 150 }}>
              <FormLabel>{t('pages.exams.addExam.fields.room')}</FormLabel>
              <Input value={room} onChange={(e) => setRoom(e.target.value)} />
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <FormControl sx={{ flex: 1, minWidth: 150 }}>
              <FormLabel>{t('pages.exams.addExam.fields.examType')}</FormLabel>
              <Select
                value={examType}
                onChange={(_, val) => setExamType(val ?? '')}
              >
                <Option value="KLAUSUR">
                  {t('pages.exams.addExam.examTypes.klausur')}
                </Option>
                <Option value="MUENDLICH">
                  {t('pages.exams.addExam.examTypes.muendlich')}
                </Option>
                <Option value="PROJEKT">
                  {t('pages.exams.addExam.examTypes.projekt')}
                </Option>
                <Option value="PRAESENTATION">
                  {t('pages.exams.addExam.examTypes.praesentation')}
                </Option>
                <Option value="ANDERES">
                  {t('pages.exams.addExam.examTypes.other')}
                </Option>
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1, minWidth: 150 }}>
              <FormLabel>{t('pages.exams.addExam.fields.semester')}</FormLabel>
              <Input
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <FormControl sx={{ width: 80 }}>
              <FormLabel>{t('pages.exams.addExam.fields.ects')}</FormLabel>
              <Input
                type="number"
                value={ects}
                onChange={(e) => setEcts(Number(e.target.value))}
              />
            </FormControl>
            <FormControl sx={{ width: 100 }}>
              <FormLabel>{t('pages.exams.addExam.fields.maxPoints')}</FormLabel>
              <Input
                type="number"
                value={maxPoints}
                onChange={(e) => setMaxPoints(Number(e.target.value))}
              />
            </FormControl>
            <FormControl sx={{ width: 120 }}>
              <FormLabel>{t('pages.exams.addExam.fields.duration')}</FormLabel>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </FormControl>
            <FormControl sx={{ width: 120 }}>
              <FormLabel>{t('pages.exams.addExam.fields.attempt')}</FormLabel>
              <Select
                value={attemptNumber}
                onChange={(_, val) => setAttemptNumber(Number(val))}
              >
                <Option value={1}>{t('pages.exams.addExam.attempts.1')}</Option>
                <Option value={2}>{t('pages.exams.addExam.attempts.2')}</Option>
                <Option value={3}>{t('pages.exams.addExam.attempts.3')}</Option>
              </Select>
            </FormControl>
          </Box>

          <FormControl
            orientation="horizontal"
            sx={{ alignItems: 'center', gap: 1 }}
          >
            <Checkbox
              checked={fileUploadRequired}
              onChange={(e) => setFileUploadRequired(e.target.checked)}
            />
            <FormLabel>
              {t('pages.exams.addExam.fields.fileUploadRequired')}
            </FormLabel>
          </FormControl>

          <FormControl>
            <FormLabel>{t('pages.exams.addExam.fields.tools')}</FormLabel>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
              {tools.map((tool) => (
                <Chip key={tool} onClick={() => handleRemoveTool(tool)}>
                  {tool}
                </Chip>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Input
                placeholder={t('pages.exams.addExam.fields.addTool')}
                value={currentTool}
                onChange={(e) => setCurrentTool(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTool();
                  }
                }}
              />
              <Button size="sm" onClick={handleAddTool}>
                {t('pages.exams.addExam.addButton')}
              </Button>
            </Box>
          </FormControl>

          <Button onClick={handleSubmit} sx={{ mt: 1 }}>
            {t('pages.exams.addExam.saveButton')}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default AddExamModal;
