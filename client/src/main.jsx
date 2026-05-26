import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { store } from './store/store';
import App from './App.jsx';
import './index.css';

const savedTheme = localStorage.getItem('appTheme');
if (savedTheme) {
  try {
    const { accentColor, mode } = JSON.parse(savedTheme);
    document.documentElement.style.setProperty('--app-primary', accentColor);
    document.documentElement.style.setProperty('--app-primary-dark', accentColor);
    document.documentElement.style.setProperty('--app-primary-soft', `${accentColor}22`);
    document.documentElement.dataset.theme = mode;
  } catch {
    localStorage.removeItem('appTheme');
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: 'var(--app-primary)',
              fontFamily: 'Inter, sans-serif',
              borderRadius: 8,
              colorBgContainer: '#ffffff',
            },
          }}
        >
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
