import { useI18n } from "../i18n.js";
import { CloseIcon, LogOutIcon } from "./teams-icons.js";

export type TeamLeaveModalProps = {
  readonly isOpen: boolean;
  readonly organizationName: string;
  readonly teamPetsCount: number;
  readonly teamPluginsCount: number;
  readonly busy: string;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
};

export function TeamLeaveModal({
  isOpen,
  organizationName,
  teamPetsCount,
  teamPluginsCount,
  busy,
  onClose,
  onConfirm,
}: TeamLeaveModalProps) {
  const { t } = useI18n();
  if (!isOpen) return null;

  const isBusy = Boolean(busy);

  return (
    <div
      className="plugin-config-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t("teams.leave.confirm")}
    >
      <button
        className="plugin-config-backdrop"
        type="button"
        aria-label={t("common.close")}
        onClick={() => !isBusy && onClose()}
      />
      <div className="team-modal">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <LogOutIcon />
            </div>
            <h3 className="m-0 font-monoDisplay text-xl font-black text-navy dark:text-slate-100">
              {t("teams.leave.title")}
            </h3>
          </div>
          <button
            type="button"
            className="text-slatecopy hover:text-navy dark:hover:text-slate-100 cursor-pointer p-1"
            disabled={isBusy}
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <CloseIcon />
          </button>
        </div>

        <p className="m-0 text-xs text-slatecopy leading-relaxed">
          {t("teams.leave.question", { organization: organizationName })}
        </p>

        <div className="rounded-xl border border-red-100 bg-red-50/50 dark:bg-red-950/30 dark:border-red-900/50 p-3 text-xs text-red-900 dark:text-red-300 leading-relaxed">
          <ul className="m-0 pl-4 list-disc space-y-1">
            <li>
              {t("teams.leave.removeAssets", { pets: teamPetsCount, plugins: teamPluginsCount })}
            </li>
            <li>
              {t("teams.leave.personalContent")}
            </li>
            <li>{t("teams.leave.rejoin")}</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            className="btn btn-compact btn-secondary text-xs"
            disabled={isBusy}
            onClick={onClose}
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className="btn btn-compact btn-danger text-xs"
            disabled={isBusy}
            onClick={onConfirm}
          >
            {busy ? t("teams.leave.leaving") : t("teams.leave.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
