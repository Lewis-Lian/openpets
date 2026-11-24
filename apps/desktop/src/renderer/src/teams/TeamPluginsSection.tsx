import { useI18n } from "../i18n.js";
import { PluginIcon } from "./teams-icons.js";
import { TeamPluginCard } from "./TeamPluginCard.js";
import type { TeamPluginEntry, TeamPluginPresentation } from "./teams-types.js";

export type TeamPluginsSectionProps = {
  readonly plugins: readonly TeamPluginEntry[];
  readonly presentations: ReadonlyMap<string, TeamPluginPresentation>;
  readonly pendingApprovalsCount: number;
  readonly busy: string;
  readonly approvingPluginId: string | null;
  readonly togglingPluginId?: string | null;
  readonly expandedPluginDetails: Record<string, boolean>;
  readonly onApprovePluginPermissions: (pluginId: string, approvalToken?: string) => void;
  readonly onSetPluginEnabled?: (pluginId: string, enabled: boolean) => void;
  readonly onTogglePluginDetails: (pluginId: string) => void;
};

export function TeamPluginsSection({
  plugins,
  presentations,
  pendingApprovalsCount,
  busy,
  approvingPluginId,
  togglingPluginId,
  expandedPluginDetails,
  onApprovePluginPermissions,
  onSetPluginEnabled,
  onTogglePluginDetails,
}: TeamPluginsSectionProps) {
  const { t } = useI18n();
  const isBusy = Boolean(busy);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="m-0 font-monoDisplay text-lg font-black text-navy dark:text-slate-100 flex items-center gap-2">
            <PluginIcon />
            <span>{t("teams.plugins.title")}</span>
            <span className="inline-flex items-center rounded-full bg-blue-100/60 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 text-[11px] font-bold text-brand">
              {plugins.length}
            </span>
            {pendingApprovalsCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200 dark:bg-amber-950/80 dark:border-amber-700 dark:text-amber-300">
                {pendingApprovalsCount} {t("teams.plugins.awaiting")}
              </span>
            )}
          </h3>
          <p className="m-0 mt-0.5 text-xs text-slatecopy">
            {t("teams.plugins.description")}
          </p>
        </div>
      </div>

      {plugins.length === 0 ? (
        <div className="flex min-h-24 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200/80 bg-blue-50/20 dark:border-slate-800 dark:bg-slate-900/40 p-5 text-center text-xs text-slatecopy">
          <span>{t("teams.plugins.empty")}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {plugins.map((plugin: TeamPluginEntry) => (
            <TeamPluginCard
              key={plugin.id}
              plugin={plugin}
              presentation={presentations.get(plugin.id)}
              isApproving={approvingPluginId === plugin.id}
              isToggling={togglingPluginId === plugin.id}
              isBusy={isBusy}
              isExpanded={Boolean(expandedPluginDetails[plugin.id])}
              onApprove={onApprovePluginPermissions}
              onSetEnabled={onSetPluginEnabled}
              onToggleDetails={onTogglePluginDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
}
