import { Box, Input, Table, Typography } from '@mui/joy';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type Exam = {
  id: string;
  modul: string;
  title: string;
  date: string;
  professor: string;
  examType?: 'WAB' | 'Klausur' | 'Präsentation' | 'Mündliche Prüfung';
};

type ExamsOverviewProps = {
  exams: Exam[];
  onSelect?: (exam: Exam) => void;
};

const columns = 5;

const ExamsOverview = ({ exams, onSelect }: ExamsOverviewProps) => {

  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(1);

  const total = exams.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / Math.max(1, rowsPerPage));
  const currentPage = totalPages === 0 ? 0 : Math.min(Math.max(1, page), totalPages);

  const start = totalPages === 0 ? 0 : (currentPage - 1) * rowsPerPage;
  const end = totalPages === 0 ? 0 : Math.min(start + rowsPerPage, total);
  const pageItems = exams.slice(start, end);

  return (
    <Box sx={{ width: '100%' }}>
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
            backgroundColor: `rgba(${theme.vars.palette.neutral.mainChannel} / 0.06)`, // 6% opacity
          },
        })}
      >
        <thead>
          <tr>
            <th style={{ width: '35%' }}>{t('pages.exams.table.title')}</th>
            <th style={{ width: '15%' }}>{t('pages.exams.table.module')}</th>
            <th style={{ width: '15%' }}>{t('pages.exams.table.date')}</th>
            <th style={{ width: '20%' }}>{t('pages.exams.table.professor')}</th>
            <th style={{ width: '15%' }}>{t('pages.exams.table.type')}</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((exam: Exam) => (
            <tr key={exam.id} onClick={() => onSelect?.(exam)}>
              <td>
                <Typography level="title-sm">{exam.title}</Typography>
              </td>
              <td>
                <Typography level="body-sm">{exam.modul}</Typography>
              </td>
              <td>
                <Typography level="body-sm">{exam.date}</Typography>
              </td>
              <td>
                <Typography level="body-sm">{exam.professor}</Typography>
              </td>
              <td>
                <Typography level="body-sm">{exam.examType}</Typography>
              </td>
            </tr>
          ))}
          {exams.length === 0 && (
            <tr>
              <td colSpan={4}>
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
                }}
              >
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
                      const next =
                        Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
                      setRowsPerPage(next);
                    }}
                    sx={{ width: 50 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography level="body-sm">{t('pages.exams.footer.page')}:</Typography>
                  <Input
                    size="sm"
                    type="number"
                    slotProps={{
                      input: { min: 0, max: Math.max(0, totalPages) },
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
                  <Typography level="body-sm">{t('pages.exams.footer.of')} {totalPages}</Typography>
                </Box>
              </Box>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Box>
  );
};

export default ExamsOverview;