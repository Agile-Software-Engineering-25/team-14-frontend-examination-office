import { Box, Button, ButtonGroup } from '@mui/joy';
import { useColorScheme } from '@mui/joy';

const TmpThemeSelectorComponent = () => {
  const { mode, setMode } = useColorScheme();

  if (!mode) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
      <ButtonGroup>
        <Button
          variant="solid"
          color={mode === 'light' ? 'primary' : 'neutral'}
          onClick={() => setMode('light')}
        >
          Light
        </Button>
        <Button
          variant="solid"
          color={mode === 'dark' ? 'primary' : 'neutral'}
          onClick={() => setMode('dark')}
        >
          Dark
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default TmpThemeSelectorComponent;
