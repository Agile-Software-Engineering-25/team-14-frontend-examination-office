import { Alert, Box, Button, Snackbar, Typography } from '@mui/joy';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useApi from '@hooks/useApi';
import SearchSelect from '@components/SearchSelect/SearchSelect';

const CertificateOverview = () => {
	const { t } = useTranslation();
	const {
		getAllStudents,
		generateCertificateForStudent,
		generateCertificatesForStudyGroup,
	} = useApi();

	const [groups, setGroups] = useState<string[]>([]);
	const [students, setStudents] = useState<any[]>([]);
	const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const loaded = (await getAllStudents()) as any[];
				if (!mounted || !loaded) return;
				setStudents(loaded);
				const unique = Array.from(
					new Set(
						loaded.map((s: any) => s.studyGroup).filter(Boolean)
					)
				) as string[];
				setGroups(unique.sort());
			} catch (e) {
				console.error('Failed to load study groups', e);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [getAllStudents]);

	const [studyGroup, setStudyGroup] = useState('');
	const [loading, setLoading] = useState(false);

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarColor, setSnackbarColor] = useState<'success' | 'danger'>('success');

	const downloadArrayBuffer = (data: ArrayBuffer, filename: string, mime = 'application/octet-stream') => {
		const blob = new Blob([data], { type: mime });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
	};

	const handleGenerateForStudent = async () => {
		if (!selectedStudent) {
			setSnackbarMessage(t('pages.certificates.error.student') || 'Bitte einen Studenten auswählen');
			setSnackbarColor('danger');
			setSnackbarOpen(true);
			return;
		}

		setLoading(true);
		try {
			let student = selectedStudent;
			if (!student || !student.id) throw new Error('Student not found');

			const data = await generateCertificateForStudent(student.id);
			const filename = `${student.lastName?.toLowerCase() || 'student'}_zeugnis.pdf`;
			downloadArrayBuffer(data, filename, 'application/pdf');
			setSnackbarMessage(t('pages.certificates.success.download') || 'Zeugnis heruntergeladen');
			setSnackbarColor('success');
			setSnackbarOpen(true);
		} catch (err: unknown) {
			console.error('Error generating certificate for student:', err);
			setSnackbarMessage(t('pages.certificates.error.student') || 'Fehler beim Generieren des Zeugnisses');
			setSnackbarColor('danger');
			setSnackbarOpen(true);
		} finally {
			setLoading(false);
		}
	};

	const handleGenerateForStudyGroup = async () => {
		if (!studyGroup) return;

		setLoading(true);
		try {
			const data = await generateCertificatesForStudyGroup(studyGroup);
			const filename = `${studyGroup.toLowerCase()}_zeugnisse.zip`;
			downloadArrayBuffer(data, filename, 'application/zip');
			setSnackbarMessage(t('pages.certificates.success.downloadGroup') || 'ZIP mit Zeugnissen heruntergeladen');
			setSnackbarColor('success');
			setSnackbarOpen(true);
		} catch (err: unknown) {
			console.error('Error generating certificates for study group:', err);
			setSnackbarMessage(t('pages.certificates.error.group') || 'Fehler beim Generieren der Zeugnisse');
			setSnackbarColor('danger');
			setSnackbarOpen(true);
		} finally {
			setLoading(false);
		}
	};

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
				{t('pages.certificates.title', { defaultValue: 'Abschlusszeugnisse' })}
			</Typography>

			{/* Certificate Generation Section */}
			<Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap'}}>
				{/* Single Student Certificate */}
				<SearchSelect
					options={students}
					value={selectedStudent}
					onChange={setSelectedStudent}
					getOptionLabel={(s: any) => `${s.firstName ?? ''} ${s.lastName ?? ''} (${s.matriculationId ?? ''}) — ${s.studyGroup ?? ''}`.trim()}
					isOptionEqualToValue={(o: any, v: any) => o?.id === v?.id}
					placeholder={t('pages.certificates.single.placeholder', { defaultValue: 'Student auswählen...' })}
					aria-label={t('pages.certificates.single.placeholder', { defaultValue: 'Student auswählen...' })}
					fullWidth={false}
					size="md"
					containerSX={{ flex: 1, minWidth: 200 }}
				/>
				<Button 
					color="primary" 
					variant="solid" 
					onClick={handleGenerateForStudent} 
					loading={loading}
					sx={{ height: 40 }}
				>
					{t('pages.certificates.single.generate', { defaultValue: 'Zeugnis erzeugen' })}
				</Button>

				{/* Study Group Certificates */}
				<SearchSelect
					options={groups}
					value={studyGroup || null}
					onChange={(val: string | null) => setStudyGroup(val ?? '')}
					getOptionLabel={(g: string) => g}
					placeholder={t('pages.certificates.group.placeholder', { defaultValue: 'Studiengruppe auswählen...' })}
					aria-label={t('pages.certificates.group.placeholder', { defaultValue: 'Studiengruppe auswählen...' })}
					fullWidth={false}
					size="md"
					containerSX={{ flex: 1, minWidth: 200 }}
				/>
				<Button 
					color="primary" 
					variant="solid" 
					onClick={handleGenerateForStudyGroup} 
					loading={loading}
					sx={{ height: 40 }}
				>
					{t('pages.certificates.group.generate', { defaultValue: 'Zeugnisse für Gruppe erzeugen' })}
				</Button>
			</Box>


			<Snackbar
				open={snackbarOpen}
				onClose={() => setSnackbarOpen(false)}
				autoHideDuration={4000}
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

export default CertificateOverview;

