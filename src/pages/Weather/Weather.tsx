import { Units } from '@custom-types/weather';
import { useTypedSelector } from '@stores/rootReducer';
import { setTemperature } from '@stores/slices/weatherSlice';
import useApi from '@hooks/useApi';
import { Box, Button, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import LanguageSelectorComponent from '@components/LanguageSelectorComponent/LanguageSelectorComponent.tsx';

const Weather = () => {
  const { t } = useTranslation();
  const { getCurrentWeather } = useApi();
  const weather = useTypedSelector((state) => state.weather.data);
  const dispatch = useDispatch();

  return (
    <Box sx={{ padding: 2, maxWidth: 700, mx: 'auto' }}>
      <Typography level="h3">{t('pages.weather.title')}</Typography>
      <Typography level="body-sm">{t('pages.weather.description')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Button
          color="neutral"
          onClick={async () => {
            const currentWeather = await getCurrentWeather(
              52.49641563400074,
              13.35777816890088,
              Units.DWD
            );
            dispatch(setTemperature(currentWeather.weather.temperature));
          }}
        >
          {t('pages.weather.getWeatherButton')}
        </Button>
      </Box>
      <Typography level="body-md">
        {t('pages.weather.weatherHeader')}:
      </Typography>
      <Typography level="body-md">
        {t('pages.weather.temperature')}: {weather.temperature} °C
      </Typography>
      <LanguageSelectorComponent />
    </Box>
  );
};

export default Weather;
