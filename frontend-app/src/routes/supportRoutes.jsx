import React from "react";
import { Route } from "react-router-dom";

const GrainsPage = React.lazy(() => import("../pages/support/GrainsPage"));
const NotesPage = React.lazy(() => import("../pages/support/notes/NotesPage"));
const TicketsPage = React.lazy(() => import("../pages/support/tickets/TicketsPage"));
const SessionsPage = React.lazy(() => import("../pages/support/SessionsPage.jsx"));

const supportRoutes = (
  <>
    <Route path="support/grains" element={<GrainsPage />} />
    <Route path="support/notes" element={<NotesPage />} />
    <Route path="support/tickets" element={<TicketsPage />} />
    <Route path="support/sessions" element={<SessionsPage />} />
  </>
);

export default supportRoutes;
