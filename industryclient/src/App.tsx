import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DeviceManagement from './pages/DeviceManagement';
import DocumentManagement from './pages/DocumentManagement';
import DataManagement from './pages/DataManagement';
import Integration from './pages/Integration';
import Designer from './pages/Designer';
import Settings from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<DeviceManagement />} />
            <Route path="/documents" element={<DocumentManagement />} />
            <Route path="/data" element={<DataManagement />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/designer" element={<Designer />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;