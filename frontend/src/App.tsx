import * as React from "react";
import { Routes, Route, Navigate } from "react-router";
import { Loading } from "./components/loading";

const DashboardLayout = React.lazy(() => import("@/layouts/dashboard-layout"));

const SignInPage = React.lazy(() => import("@/pages/auth/sign-in"));
const DashboardPage = React.lazy(() => import("@/pages/dashboard/dashboard"));
const SequenceInputPage = React.lazy(
  () => import("@/pages/dashboard/sequence-input"),
);
const SettingsPage = React.lazy(() => import("@/pages/dashboard/settings"));
const AgentsPage = React.lazy(() => import("@/pages/dashboard/agents"));
const StructureViewerPage = React.lazy(
  () => import("@/pages/dashboard/structure-viewer"),
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/auth/sign-in"
        element={
          <React.Suspense fallback={<Loading />}>
            <SignInPage />
          </React.Suspense>
        }
      />
      <Route
        path="/"
        element={
          <React.Suspense fallback={<Loading />}>
            <DashboardLayout />
          </React.Suspense>
        }
      >
        <Route
          path="/dashboard/settings"
          element={
            <React.Suspense fallback={<Loading />}>
              <SettingsPage />
            </React.Suspense>
          }
        />
        <Route
          path="/dashboard/agents"
          element={
            <React.Suspense fallback={<Loading />}>
              <AgentsPage />
            </React.Suspense>
          }
        />
        <Route
          path="/dashboard/projects/:projectId/predict/new"
          element={
            <React.Suspense fallback={<Loading />}>
              <SequenceInputPage />
            </React.Suspense>
          }
        />
        <Route
          path="/dashboard/projects/:projectId/predict/:predictionId"
          element={
            <React.Suspense fallback={<Loading />}>
              <DashboardPage />
            </React.Suspense>
          }
        />
        <Route
          path="/dashboard/structure-viewer/:pdbFileName"
          element={
            <React.Suspense fallback={<Loading />}>
              <StructureViewerPage />
            </React.Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
