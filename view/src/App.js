import React from 'react';


import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Todos from './components/todos';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#e5ffff', //lightTeal
			main: '#008394', //darkerTeal
			dark: '#82ada9', //darkestTeal
			contrastText: '#fff' //white
		}
	}
});

function App() {
	return (
        <MuiThemeProvider theme={theme}>
        <Todos />
        </MuiThemeProvider>
    );
}


export default App;
