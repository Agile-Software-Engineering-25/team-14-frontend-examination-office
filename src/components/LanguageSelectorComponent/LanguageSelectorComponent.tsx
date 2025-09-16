import { Box, Button, ButtonGroup } from '@mui/joy';
import { useTranslation } from 'react-i18next';

const LanguageSelectorComponent = () => {
  const { i18n } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
      <ButtonGroup>
        <Button
          onClick={() => i18n.changeLanguage('en-US')}
          variant="solid"
          color={i18n.language === 'en-US' ? 'primary' : 'neutral'}
        >
          English
        </Button>
        <Button
          variant="solid"
          color={i18n.language === 'de-DE' ? 'primary' : 'neutral'}
          onClick={() => i18n.changeLanguage('de-DE')}
        >
          Deutsch
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default LanguageSelectorComponent;
