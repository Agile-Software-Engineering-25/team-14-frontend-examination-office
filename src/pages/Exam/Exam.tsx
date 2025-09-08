import LanguageSelectorComponent from "@/components/LanguageSelectorComponent/LanguageSelectorComponent";
import { 
  Box, 
  Button,
  Typography
} from "@mui/joy";
import { useState } from "react";
import AddExamModal from "./AddExamModal";
import EditExamModal from "./EditExamModal";

const mockExam = {
  id: 0,
  title: "Kickflip Thesis",
  moduleCode: "KFTA23",
  examDate: "07.11.2025, 09:00",
  room: "-",
  examType: "Projekt",
  semester: "5",
  ects: 30,
  maxPoints: 1234,
  duration: 0,
  attemptNumber: 1,
  fileUploadRequired: true,
  tools: [],
}

const ExamCreationModal = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <Box sx={{ padding: 2, maxWidth: 700, mx: "auto" }}>
      <Typography level="h4">Prüfungskomponenten</Typography>
      <Button onClick={() => setAddModalOpen(true)} sx={{ mt: 2 }}>
        Prüfung Hinzufügen
      </Button>
      <Button onClick={()=> setEditModalOpen(true)} sx={{ mt: 2 }}>
        Prüfung Bearbeiten
      </Button>

      <AddExamModal open={addModalOpen} setOpen={setAddModalOpen} onAdd={(url: string)=>{console.log('added', url)}} />
      <EditExamModal open={editModalOpen} setOpen={setEditModalOpen} onSave={(exam)=>{console.log("Saving exam", exam)}} exam={mockExam} />

      <LanguageSelectorComponent />
    </Box>
  );
};

export default ExamCreationModal;
