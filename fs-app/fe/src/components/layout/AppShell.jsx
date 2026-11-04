import { AlertTriangle } from "lucide-react";
import { getNavItem } from "../../app/navigation";
import { PAGE_REGISTRY } from "../../app/pageRegistry";
import { useBanking } from "../../hooks/useBanking";
import { useRoute } from "../../hooks/useRoute";
import { Layout } from "./Layout";

export function AppShell() {
  const path = useRoute();
  const { error } = useBanking();

  const page = getNavItem(path);
  const Page = PAGE_REGISTRY[path] ?? PAGE_REGISTRY["/dashboard"];

  return (
    <Layout page={page} activePath={page.path}>
      {error ? (
        <div className="alert alert--danger" role="alert">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}
      <Page />
    </Layout>
  );
}
