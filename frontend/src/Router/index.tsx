import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../view/layouts/AppLayout';
import { Home } from '../view/Home';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
