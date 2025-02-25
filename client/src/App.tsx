import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "@/components/Layout";
import TasksPage from "@/pages/tasks";
import MediaPage from "@/pages/media";
import RemindersPage from "@/pages/reminders";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <SidebarProvider>
      <Layout>
        <Switch>
          <Route path="/" component={TasksPage} />
          <Route path="/media" component={MediaPage} />
          <Route path="/reminders" component={RemindersPage} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;