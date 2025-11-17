import {
  Box,
  Button,
  Input,
  Table,
  Typography,
  Switch,
  Modal,
  List,
  ListItem,
  ListItemButton,
} from '@mui/joy';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useApi from '@/hooks/useApi';
import type { Feedback } from '@custom-types/feedback';
import type { ExamState } from '@custom-types/exam';
import { ListItemText } from '@mui/material';

type SubmissionOverviewProps = {
  examUuid: string;
};

const columns = 7;

const SubmissionOverview = ({ examUuid }: SubmissionOverviewProps) => {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  const [rowStates, setRowStates] = useState<Record<string, ExamState>>({});
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [changesMade, setChangesMade] = useState(false);
  const [onlyUnapproved, setOnlyUnapproved] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState('');

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  const {
    getFeedbacksForExam,
    acceptFeedbackForExamStudent,
    rejectFeedbackForExamStudent,
  } = useApi();

  // Fetch feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const data = await getFeedbacksForExam(examUuid);
        setFeedbacks(data);

        const initialStates: Record<string, ExamState> = {};
        data.forEach((fb) => {
          initialStates[fb.studentUuid] = fb.examState;
        });
        setRowStates(initialStates);
        setSelectedRows({});
        setChangesMade(false);
      } catch (err) {
        console.error('Error fetching feedbacks', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [examUuid, getFeedbacksForExam]);

  const toggleStatus = (uuid: string, newState: ExamState) => {
    setRowStates((prev) => {
      const updated = { ...prev, [uuid]: newState };
      setSelectedRows((selPrev) => ({ ...selPrev, [uuid]: true }));

      const changed = Object.entries(updated).some(([id, state]) => {
        const orig = feedbacks.find((fb) => fb.studentUuid === id)?.examState;
        return orig !== state;
      });
      setChangesMade(changed);
      return updated;
    });
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      for (const [studentUuid, selected] of Object.entries(selectedRows)) {
        if (!selected) continue;
        const fb = feedbacks.find((f) => f.studentUuid === studentUuid);
        if (!fb) continue;
        const newState = rowStates[studentUuid];
        if (newState === fb.examState) continue;

        if (newState === 'EXAM_ACCEPTED') {
          await acceptFeedbackForExamStudent(fb.examUuid, fb.studentUuid);
        } else if (newState === 'EXAM_REJECTED') {
          await rejectFeedbackForExamStudent(fb.examUuid, fb.studentUuid);
        }
      }

      const refreshed = await getFeedbacksForExam(examUuid);
      setFeedbacks(refreshed);

      const refreshedStates: Record<string, ExamState> = {};
      refreshed.forEach(
        (fb) => (refreshedStates[fb.studentUuid] = fb.examState)
      );
      setRowStates(refreshedStates);

      setSelectedRows({});
      setChangesMade(false);
    } catch (err) {
      console.error('Error saving changes', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = useMemo(() => {
    return feedbacks
      .filter(
        (fb) =>
          fb.studentUuid.toLowerCase().includes(search.toLowerCase()) ||
          fb.lecturerUuid.toLowerCase().includes(search.toLowerCase())
      )
      .filter((fb) => !onlyUnapproved || fb.examState === 'EXAM_GRADED');
  }, [feedbacks, search, onlyUnapproved]);

  // 🩹 Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, onlyUnapproved, rowsPerPage]);

  const total = filteredFeedbacks.length;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, rowsPerPage)));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * rowsPerPage;
  const end = Math.min(start + rowsPerPage, total);
  const pageItems = filteredFeedbacks.slice(start, end);

  return (
    <Box sx={{ width: '100%', p: 0, m: 0 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Input
          placeholder={t('pages.submissions.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 200, maxHeight: 40 }}
        />
        <Switch
          checked={onlyUnapproved}
          onChange={(e) => setOnlyUnapproved(e.target.checked)}
          color="neutral"
          endDecorator={t('pages.submissions.onlyUnapproved', {
            defaultValue: 'Show only unapproved',
          })}
        />
        <Button disabled={!changesMade || loading} onClick={saveChanges}>
          {t('pages.submissions.saveChanges', { defaultValue: 'Save Changes' })}
        </Button>
      </Box>

      <Table aria-label="Submissions" size="md" hoverRow variant="outlined">
        <thead>
          <tr>
            <th style={{ width: '5%' }}></th>
            <th style={{ width: '20%' }}>
              {t('pages.submissions.table.student')}
            </th>
            <th style={{ width: '20%' }}>
              {t('pages.submissions.table.lecturer')}
            </th>
            <th style={{ width: '10%' }}>
              {t('pages.submissions.table.gradedAt')}
            </th>
            <th style={{ width: '10%' }}>
              {t('pages.submissions.table.points')}
            </th>
            <th style={{ width: '10%' }}>
              {t('pages.submissions.table.grade')}
            </th>
            <th style={{ width: '25%' }}>
              {t('pages.submissions.table.status')}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7}>
                <Typography textAlign="center">
                  {t('pages.submissions.loading')}
                </Typography>
              </td>
            </tr>
          ) : pageItems.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <Typography textAlign="center">
                  {t('pages.submissions.zeroFeedbacks')}
                </Typography>
              </td>
            </tr>
          ) : (
            pageItems.map((fb) => {
              const originalState = fb.examState;
              const currentState = rowStates[fb.studentUuid] ?? originalState;
              const acceptActive = currentState === 'EXAM_ACCEPTED';
              const rejectActive = currentState === 'EXAM_REJECTED';
              const isGraded = originalState === 'EXAM_GRADED';
              return (
                <tr
                  key={fb.studentUuid}
                  onClick={() => setSelectedFeedback(fb)}
                  style={{ cursor: 'pointer' }}
                >
                  <td></td>
                  <td>{fb.studentName ? fb.studentName : fb.studentUuid}</td>
                  <td>
                    {fb?.lecturerName ? fb.lecturerName : fb.lecturerUuid}
                  </td>
                  <td>{fb.gradedAt}</td>
                  <td>{fb.points}</td>
                  <td>{fb.grade}</td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant={acceptActive ? 'solid' : 'outlined'}
                        color="success"
                        size="sm"
                        disabled={!isGraded && !acceptActive && !rejectActive}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(
                            fb.studentUuid,
                            'EXAM_ACCEPTED' as ExamState
                          );
                        }}
                      >
                        {t('pages.submissions.accept', {
                          defaultValue: 'Accept',
                        })}
                      </Button>
                      <Button
                        variant={rejectActive ? 'solid' : 'outlined'}
                        color="danger"
                        size="sm"
                        disabled={!isGraded && !acceptActive && !rejectActive}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(
                            fb.studentUuid,
                            'EXAM_REJECTED' as ExamState
                          );
                        }}
                      >
                        {t('pages.submissions.reject', {
                          defaultValue: 'Reject',
                        })}
                      </Button>
                    </Box>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={columns}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  p: 0.5,
                  width: '100%',
                }}
              >
                {/* Rows per page */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography level="body-sm">
                    {t('pages.exams.footer.itemsPerPage')}:
                  </Typography>
                  <Input
                    size="sm"
                    type="number"
                    slotProps={{ input: { min: 1 } }}
                    value={rowsPerPage}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      setRowsPerPage(
                        Number.isFinite(n) && n > 0 ? Math.floor(n) : 1
                      );
                      setPage(1); // ✅ reset page when rowsPerPage changes
                    }}
                    sx={{ width: 50 }}
                  />
                </Box>

                {/* Pagination */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography level="body-sm">
                    {t('pages.exams.footer.page')}:
                  </Typography>

                  <Button
                    size="sm"
                    variant="outlined"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    {t('pages.exams.footer.previous', { defaultValue: '←' })}
                  </Button>

                  <Input
                    size="sm"
                    type="number"
                    slotProps={{
                      input: { min: 1, max: Math.max(1, totalPages) },
                    }}
                    value={currentPage}
                    disabled={totalPages === 0}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (!Number.isFinite(n)) return;
                      setPage(Math.floor(n));
                    }}
                    sx={{ width: 50, textAlign: 'center' }}
                  />

                  <Typography level="body-sm">
                    {t('pages.exams.footer.of')} {totalPages}
                  </Typography>

                  <Button
                    size="sm"
                    variant="outlined"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    {t('pages.exams.footer.next', { defaultValue: '→' })}
                  </Button>
                </Box>
              </Box>
            </td>
          </tr>
        </tfoot>
      </Table>

      <Modal
        open={!!selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.body',
            borderRadius: 2,
            p: 3,
            boxShadow: 24,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {selectedFeedback && (
            <>
              <Typography level="h4" mb={2}>
                Feedback Details
              </Typography>
              <Typography>
                <strong>{t('pages.submissions.table.student')}:</strong>{' '}
                {selectedFeedback.studentName
                  ? selectedFeedback.studentName
                  : selectedFeedback.studentUuid}
              </Typography>
              <Typography>
                <strong>{t('pages.submissions.table.lecturer')}:</strong>{' '}
                {selectedFeedback.lecturerName
                  ? selectedFeedback.lecturerName
                  : selectedFeedback.lecturerUuid}
              </Typography>
              <Typography>
                <strong>{t('pages.submissions.table.gradedAt')}:</strong>{' '}
                {selectedFeedback.gradedAt}
              </Typography>
              <Typography>
                <strong>{t('pages.submissions.table.points')}:</strong>{' '}
                {selectedFeedback.points}
              </Typography>
              <Typography>
                <strong>{t('pages.submissions.table.grade')}:</strong>{' '}
                {selectedFeedback.grade}
              </Typography>
              <Typography mt={2}>
                <strong>{t('pages.submissions.table.comment')}:</strong>
              </Typography>
              <Typography mb={2}>
                {selectedFeedback.comment || 'No comment'}
              </Typography>

              <Typography>
                <strong>{t('pages.submissions.table.files')}:</strong>
              </Typography>
              {selectedFeedback.fileReference ? (
                selectedFeedback.fileReference.length > 0 ? (
                  <List>
                    {selectedFeedback.fileReference.map((file) => (
                      <ListItem key={file.fileUuid}>
                        <ListItemButton
                          component="a"
                          href={file.downloadLink ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          disabled={!file.downloadLink}
                        >
                          <ListItemText primary={file.filename} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography>{t('pages.submissions.noFiles')}.</Typography>
                )
              ) : (
                <Typography>{t('pages.submissions.noFiles')}.</Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={() => setSelectedFeedback(null)}>
                  {t('pages.submissions.close')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default SubmissionOverview;
