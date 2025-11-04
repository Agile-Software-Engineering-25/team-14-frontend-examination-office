import { type ReactNode } from 'react';
import { Box, useColorScheme } from '@mui/joy';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Search as SearchIcon } from '@mui/icons-material';
import type { SxProps } from '@mui/joy/styles/types';

export type SearchSelectSize = 'sm' | 'md' | 'lg';

export interface SearchSelectProps<T> {
  options: T[];
  value?: T | null;
  onChange?: (value: T | null) => void;
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  placeholder?: string;
  size?: SearchSelectSize;
  fullWidth?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  multiple?: boolean;
  disableClearable?: boolean;
  renderOption?: (props: any, option: T) => ReactNode;
  startDecorator?: ReactNode;
  endDecorator?: ReactNode;
  inputSX?: SxProps;
  containerSX?: SxProps;
  'aria-label'?: string;
}

/**
 * A searchable select/dropdown component combining SearchBar's styling with Autocomplete functionality.
 * Based on the shared SearchBar component design with added dropdown/autocomplete capabilities.
 *
 * @template T - The type of options in the dropdown
 * @param {SearchSelectProps<T>} props - The props for the SearchSelect component
 * @param {T[]} props.options - Array of options to display in dropdown
 * @param {T | null} [props.value] - Currently selected value
 * @param {function} [props.onChange] - Callback when selection changes
 * @param {function} props.getOptionLabel - Function to extract label from option
 * @param {function} [props.isOptionEqualToValue] - Custom equality check for options
 * @param {string} [props.placeholder="Search..."] - Placeholder text
 * @param {SearchSelectSize} [props.size="md"] - Size of the component
 * @param {boolean} [props.fullWidth=false] - Whether to take full width
 * @param {boolean} [props.autoFocus=false] - Whether to auto focus on mount
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {boolean} [props.readOnly=false] - Whether the input is read-only
 * @param {boolean} [props.required=false] - Whether the input is required
 * @param {boolean} [props.error=false] - Whether the input has an error state
 * @param {boolean} [props.multiple=false] - Enable multiple selection
 * @param {boolean} [props.disableClearable=false] - Disable clear button
 * @param {function} [props.renderOption] - Custom option renderer
 * @param {ReactNode} [props.startDecorator] - Custom start decorator (overrides search icon)
 * @param {ReactNode} [props.endDecorator] - End decorator element
 * @param {SxProps} [props.inputSX] - Additional styles for input element
 * @param {SxProps} [props.containerSX] - Additional styles for container
 * @param {string} [props.aria-label] - Accessible label for screen readers
 * @returns {JSX.Element} The rendered SearchSelect component
 */
function SearchSelect<T>({
  options,
  value,
  onChange,
  getOptionLabel,
  isOptionEqualToValue,
  placeholder = 'Search...',
  size = 'md',
  fullWidth = false,
  autoFocus = false,
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  multiple = false,
  disableClearable = false,
  renderOption,
  startDecorator,
  endDecorator,
  inputSX,
  containerSX,
  'aria-label': ariaLabel,
}: SearchSelectProps<T>): JSX.Element {
  const muiSize = size === 'sm' ? 'small' : size === 'lg' ? 'medium' : 'small';
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';

  const defaultStartDecorator = (
    <SearchIcon
      fontSize="medium"
      sx={{
        color: (theme) => theme.palette.text.secondary,
        mr: 0.5,
      }}
    />
  );

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', ...containerSX }}>
      <Autocomplete
        options={options}
        value={value ?? null}
        onChange={(_, newValue) => {
          if (multiple) {
            // For multiple mode, newValue is T[], we need to handle it differently
            onChange?.(newValue as T | null);
          } else {
            onChange?.(newValue as T | null);
          }
        }}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        disabled={disabled}
        readOnly={readOnly}
        multiple={multiple as any}
        disableClearable={disableClearable}
        renderOption={renderOption}
        slotProps={{
          paper: {
            sx: {
              // Light mode: #FFF, Dark mode: lighter background for visibility
              bgcolor: isDark
                ? 'rgba(30, 30, 35, 1)' // Lighter dark background
                : '#FFFFFF',
              color: isDark
                ? 'rgba(255, 255, 255, 0.92)' // High contrast text
                : 'rgba(0, 0, 0, 0.87)',
              border: '1px solid',
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.3)' // More visible border
                : 'rgba(0, 0, 0, 0.2)',
              boxShadow: isDark
                ? '0 8px 24px rgba(0, 0, 0, 0.8)'
                : '0 2px 8px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
              mt: 0.5,
              // Ensure dropdown items are visible
              '& .MuiAutocomplete-option': {
                color: isDark
                  ? 'rgba(255, 255, 255, 0.92)'
                  : 'rgba(0, 0, 0, 0.87)',
                '&:hover': {
                  bgcolor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
                '&[aria-selected="true"]': {
                  bgcolor: isDark
                    ? 'rgba(0, 172, 233, 0.3)'
                    : 'rgba(0, 46, 109, 0.12)',
                },
              },
            },
          },
          popper: {
            sx: { zIndex: 1500 },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            required={required}
            error={error}
            autoFocus={autoFocus}
            inputProps={{
              ...params.inputProps,
              'aria-label': ariaLabel || placeholder,
            }}
            variant="outlined"
            size={muiSize}
            sx={{
              '& .MuiInputBase-root': {
                // Light mode: rgba(0, 0, 0, 0.08), Dark mode: rgba(255, 255, 255, 0.12)
                bgcolor: isDark 
                  ? 'rgba(255, 255, 255, 0.12)' 
                  : 'rgba(0, 0, 0, 0.08)',
                color: isDark
                  ? 'rgba(255, 255, 255, 0.92)' // High contrast text in dark mode
                  : 'rgba(0, 0, 0, 0.87)',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                paddingLeft: startDecorator || defaultStartDecorator ? '8px' : undefined,
                height: 40,
                fontFamily: "'Poppins', sans-serif",
                fontSize: '14px',
                fontWeight: 300,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                // Light mode: rgba(0, 0, 0, 0.2), Dark mode: rgba(255, 255, 255, 0.2)
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.2)',
                borderWidth: '1px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                // Light mode: rgba(0, 0, 0, 0.4), Dark mode: rgba(255, 255, 255, 0.3)
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(0, 0, 0, 0.4)',
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                // Primary color for focus
                borderColor: isDark
                  ? '#00ACE9' // primary.500 dark mode
                  : '#002E6D', // primary.500 light mode
                borderWidth: '2px',
              },
              '& .MuiInputBase-input::placeholder': {
                // Light mode: rgba(0, 0, 0, 0.5), Dark mode: rgba(255, 255, 255, 0.5)
                color: isDark
                  ? 'rgba(255, 255, 255, 0.5)'
                  : 'rgba(0, 0, 0, 0.5)',
                opacity: 1,
                fontFamily: "'Poppins', sans-serif",
              },
              // Ensure the clear button is visible in dark mode
              '& .MuiAutocomplete-clearIndicator': {
                color: isDark
                  ? 'rgba(255, 255, 255, 0.7)'
                  : 'rgba(0, 0, 0, 0.54)',
              },
              // Ensure the dropdown arrow is visible in dark mode
              '& .MuiAutocomplete-popupIndicator': {
                color: isDark
                  ? 'rgba(255, 255, 255, 0.7)'
                  : 'rgba(0, 0, 0, 0.54)',
              },
              ...(inputSX as any),
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {startDecorator || defaultStartDecorator}
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  {endDecorator}
                </>
              ),
            }}
          />
        )}
      />
    </Box>
  );
}

export default SearchSelect;
