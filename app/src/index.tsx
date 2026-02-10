import '../global.css';
import { registerRootComponent } from 'expo';
import { RootNavigator } from './navigation/RootNavigator';

import { ColorThemeProvider } from './shared/providers/ColorThemeProvider';
import { AuthProvider } from './shared/providers/AuthProvider';

function App() {
    return (
        <ColorThemeProvider>
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </ColorThemeProvider>
    );
}

registerRootComponent(App);
