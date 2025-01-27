import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../view/layouts/AppLayout';
import { Home } from '../view/Home';
import { FileDetails } from '../view/FileDetails';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <AppLayout>
              <Outlet />
            </AppLayout>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/file-detail/:id" element={<FileDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
