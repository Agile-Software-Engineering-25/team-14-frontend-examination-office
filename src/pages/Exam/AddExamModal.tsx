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
  Chip
} from "@mui/joy";
import axios from "axios";
import { useState } from "react";

const AddExamModal = ({ open, setOpen, onAdd=()=>{} }: { open: boolean, setOpen: CallableFunction, onAdd?: CallableFunction }) => {
  const [title, setTitle] = useState("");
  const [moduleCode, setModuleCode] = useState("");
  const [examDate, setExamDate] = useState("");
  const [room, setRoom] = useState("");
  const [examType, setExamType] = useState("");
  const [semester, setSemester] = useState("");
  const [ects, setEcts] = useState(5);
  const [maxPoints, setMaxPoints] = useState(100);
  const [duration, setDuration] = useState(90);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [fileUploadRequired, setFileUploadRequired] = useState(false);
  const [tools, setTools] = useState<string[]>([]);
  const [currentTool, setCurrentTool] = useState("");

  const handleAddTool = () => {
    if (currentTool.trim() && !tools.includes(currentTool.trim())) {
      setTools([...tools, currentTool.trim()]);
      setCurrentTool("");
    }
  };

  const handleRemoveTool = (tool: string) => {
    setTools(tools.filter(t => t !== tool));
  };

  const handleSubmit = () => {
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
    axios.post("/api/exams", newExam).then((res) => {
      onAdd(res.data)
    });
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog variant="outlined" sx={{ width: "fit-content", maxWidth: "90%" }}>
        <ModalClose />
        <Typography level="h4">Neue Prüfung anlegen</Typography>

        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <FormControl>
            <FormLabel>Titel</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Modulcode</FormLabel>
            <Input value={moduleCode} onChange={(e) => setModuleCode(e.target.value)} />
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Datum</FormLabel>
              <Input type="datetime-local" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Raum</FormLabel>
              <Input value={room} onChange={(e) => setRoom(e.target.value)} />
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Prüfungsart</FormLabel>
              <Select value={examType} onChange={(_, val) => setExamType(val ?? "")}>
                <Option value="KLAUSUR">Klausur</Option>
                <Option value="MUENDLICH">Mündlich</Option>
                <Option value="PROJEKT">Projekt</Option>
                <Option value="PRAESENTATION">Präsentation</Option>
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Semester</FormLabel>
              <Input value={semester} onChange={(e) => setSemester(e.target.value)} />
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl>
              <FormLabel>ECTS</FormLabel>
              <Input type="number" value={ects} onChange={(e) => setEcts(Number(e.target.value))} />
            </FormControl>
            <FormControl>
              <FormLabel>Max. Punkte</FormLabel>
              <Input type="number" value={maxPoints} onChange={(e) => setMaxPoints(Number(e.target.value))} />
            </FormControl>
            <FormControl>
              <FormLabel>Dauer (Minuten)</FormLabel>
              <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
            </FormControl>
            <FormControl>
              <FormLabel>Versuch</FormLabel>
              <Select value={attemptNumber} onChange={(_, val) => setAttemptNumber(Number(val))}>
                <Option value={1}>1. Versuch</Option>
                <Option value={2}>2. Versuch</Option>
                <Option value={3}>3. Versuch</Option>
              </Select>
            </FormControl>
          </Box>

          <FormControl orientation="horizontal">
            <Checkbox
              checked={fileUploadRequired}
              onChange={(e) => setFileUploadRequired(e.target.checked)}
            />
            <FormLabel sx={{ ml: 1 }}>Datei-Upload erforderlich</FormLabel>
          </FormControl>

          <FormControl>
            <FormLabel>Hilfsmittel</FormLabel>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {tools.map((tool) => (
                <Chip key={tool} onClick={() => handleRemoveTool(tool)}>{tool}</Chip>
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Input
                placeholder="Neues Hilfsmittel"
                value={currentTool}
                onChange={(e) => setCurrentTool(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTool(); } }}
              />
              <Button onClick={handleAddTool}>Hinzufügen</Button>
            </Box>
          </FormControl>

          <Button onClick={handleSubmit} sx={{ mt: 2 }}>Speichern</Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default AddExamModal;
