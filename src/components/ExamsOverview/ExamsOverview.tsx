import { Box, Button, Input, Table, Typography } from '@mui/joy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Exam } from '@custom-types/exam';
import EditExamModal from '@components/Exam/EditExamModal';
import AddExamModal from '@components/Exam/AddExamModal';

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
  const [editModalExam, setEditModalExam] = useState<Exam | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Filter + search
  const filteredExams = exams.filter((exam) => {
    const searchTerm = search.toLowerCase();
    return (
      exam.title.toLowerCase().includes(searchTerm) ||
      exam.moduleCode.toLowerCase().includes(searchTerm) ||
      exam.room.toLowerCase().includes(searchTerm) ||
      exam.semester.toLowerCase().includes(searchTerm)
    );
  });

  const total = filteredExams.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / Math.max(1, rowsPerPage));
  const currentPage = totalPages === 0 ? 0 : Math.min(Math.max(1, page), totalPages);

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

      {/* Exams Table */}
      <Table
        aria-label="Exams Overview"
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
            <tr
              key={exam.id}
              onClick={(e) => {
                // prevent clicks on icons/buttons from selecting
                if ((e.target as HTMLElement).closest('svg, button, [role="button"]')) return;
                onSelect?.(exam);
              }}
              style={{ cursor: 'pointer' }}
            >
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
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevent row select
                      setEditModalExam(exam);
                    }}
                    sx={{ cursor: 'pointer', color: 'primary.main' }}
                    titleAccess={t('pages.exams.table.edit')}
                  />
                  <DeleteIcon
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevent row select
                      e.preventDefault();
                      onDelete?.(exam);
                    }}
                    sx={{ cursor: 'pointer', color: 'darkred' }}
                    titleAccess={t('pages.exams.table.delete')}
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
                      setRowsPerPage(Number.isFinite(n) && n > 0 ? Math.floor(n) : 1);
                    }}
                    sx={{ width: 50 }}
                  />
                </Box>

                {/* Pagination */}
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

      {/* Edit Modal */}
      {editModalExam && (
        <EditExamModal
          open={Boolean(editModalExam)}
          setOpen={() => setEditModalExam(null)}
          onSave={(updatedExam: Exam) => {
            onEdit?.(updatedExam);
            setEditModalExam(null);
          }}
          exam={editModalExam}
        />
      )}
    </Box>
  );
};

export default ExamsOverview;
