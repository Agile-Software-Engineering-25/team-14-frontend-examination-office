import { BrowserRouter } from 'react-router';
import RoutingComponent from '@components/RoutingComponent/RoutingComponent';
import { createCustomTheme } from '@agile-software/shared-components';
import { THEME_ID as MATERIAL_THEME_ID, ThemeProvider } from '@mui/material';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy';
import './i18n';
import { Provider } from 'react-redux';
import store from '@stores/index.ts';
import VerticalMenu from './Menu.tsx';

const theme = createCustomTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          500: '#your-primary-color',
        },
      },
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

type AppProps = {
  basename?: string;
};

function App({ basename }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={{ [MATERIAL_THEME_ID]: theme }}>
        <JoyCssVarsProvider>
          <BrowserRouter basename={basename}>
            <div
              style={{
                display: 'flex',
                height: '100vh',
                margin: 0,
                padding: 0,
              }}
            >
              <VerticalMenu />
              <div style={{ flex: 1, overflow: 'auto' }}>
                <RoutingComponent />
              </div>
            </div>
          </BrowserRouter>
        </JoyCssVarsProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
