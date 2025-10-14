import { Box, Button, Input, Table, Typography } from '@mui/joy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Exam } from '@custom-types/exam';
import EditExamModal from '@components/Exam/EditExamModal';
import AddExamModal from '@components/Exam/AddExamModal';
import AddStudentsModal from '@components/Students/AddStudentsModal';

type ExamsOverviewProps = {
  exams: Exam[];
  onSelect?: (exam: Exam) => void;
  onAdd?: (exam: Exam) => void;
  onEdit?: (exam: Exam) => void;
  onDelete?: (exam: Exam) => void;
};

const columns = 6;

const ExamsOverview = ({
  exams,
  onSelect,
  onDelete,
  onAdd,
  onEdit,
}: ExamsOverviewProps) => {
  const { t } = useTranslation();

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addStudentsModalOpen, setAddStudentsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Filter + search
  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.moduleCode.toLowerCase().includes(search.toLowerCase()) ||
      exam.room.toLowerCase().includes(search.toLowerCase()) ||
      exam.semester.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const total = filteredExams.length;
  const totalPages =
    total === 0 ? 0 : Math.ceil(total / Math.max(1, rowsPerPage));
  const currentPage =
    totalPages === 0 ? 0 : Math.min(Math.max(1, page), totalPages);

  const start = totalPages === 0 ? 0 : (currentPage - 1) * rowsPerPage;
  const end = totalPages === 0 ? 0 : Math.min(start + rowsPerPage, total);
  const pageItems = filteredExams.slice(start, end);

  return (
    <Box sx={{ width: '100%', p: 0, m: 0 }}>
      {/* Search + Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Input
          placeholder="Suche nach Titel, Modul oder Professor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 200, maxHeight: 40 }}
        />
        <Button onClick={() => setAddModalOpen(true)} sx={{ height: 40 }}>
          {t('pages.exams.addExam.button')}
        </Button>
        <AddExamModal
          open={addModalOpen}
          setOpen={setAddModalOpen}
          onAdd={onAdd}
        />
      </Box>

      <Table
        aria-label={'Exams Overview'}
        borderAxis="x"
        color="neutral"
        size="md"
        stickyFooter
        stickyHeader
        variant="outlined"
        hoverRow
        sx={(theme) => ({
          '& tbody tr:hover, & tbody tr:hover > td': {
            backgroundColor: `rgba(${theme.vars.palette.neutral.mainChannel} / 0.06)`,
          },
        })}
      >
        <thead>
          <tr>
            <th style={{ width: '35%' }}>{t('pages.exams.table.title')}</th>
            <th style={{ width: '15%' }}>{t('pages.exams.table.module')}</th>
            <th style={{ width: '10%' }}>{t('pages.exams.table.date')}</th>
            <th style={{ width: '20%' }}>{t('pages.exams.table.professor')}</th>
            <th style={{ width: '10%' }}>{t('pages.exams.table.type')}</th>
            <th style={{ width: '10%' }}>{t('pages.exams.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((exam: Exam) => (
            <tr key={exam.id} onClick={() => onSelect?.(exam)}>
              <td>
                <Typography level="title-sm">{exam.title}</Typography>
              </td>
              <td>
                <Typography level="body-sm">{exam.moduleCode}</Typography>
              </td>
              <td>
                <Typography level="body-sm">{exam.examDate}</Typography>
              </td>
              <td>
                <Typography level="body-sm">{exam.room}</Typography>
              </td>
              <td>
                <Typography level="body-sm">{exam.examType}</Typography>
              </td>
              <td>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <EditIcon
                    onClick={() => setEditModalOpen(true)}
                    sx={{ cursor: 'pointer', color: 'primary.main' }}
                    titleAccess={t('pages.exams.table.edit')}
                  />
                  <DeleteIcon
                    onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                      onDelete?.(exam);
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    sx={{ cursor: 'pointer', color: 'darkred' }}
                    titleAccess={t('pages.exams.table.delete')}
                  />
                  <AddIcon
                    onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setSelectedExam(exam);
                      setAddStudentsModalOpen(true);
                    }}
                    sx={{ cursor: 'pointer', color: 'success.main' }}
                  />
                  <EditExamModal
                    open={editModalOpen}
                    setOpen={setEditModalOpen}
                    onSave={
                      onEdit
                        ? (updatedExam: Exam) => onEdit(updatedExam)
                        : () => {}
                    }
                    exam={exam}
                  />
                </Box>
              </td>
            </tr>
          ))}
          {filteredExams.length === 0 && (
            <tr>
              <td colSpan={columns}>
                <Box sx={{ p: 2, textAlign: 'center', opacity: 0.7 }}>
                  <Typography level="body-sm">No exams to display.</Typography>
                </Box>
              </td>
            </tr>
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    width: 'auto',
                  }}
                >
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
                      const next =
                        Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
                      setRowsPerPage(next);
                    }}
                    sx={{ width: 50 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography level="body-sm">
                    {t('pages.exams.footer.page')}:
                  </Typography>
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
                    sx={{ width: 50 }}
                  />
                  <Typography level="body-sm">
                    {t('pages.exams.footer.of')} {totalPages}
                  </Typography>
                </Box>
              </Box>
            </td>
          </tr>
        </tfoot>
      </Table>
      <AddStudentsModal
        open={addStudentsModalOpen}
        setOpen={setAddStudentsModalOpen}
        exam={selectedExam}
      />
    </Box>
  );
};

export default ExamsOverview;
