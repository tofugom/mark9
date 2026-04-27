import React from "react";
import { Type, Palette } from "lucide-react";
import { useSettingsStore } from "../stores/settings-store.js";
import { useThemeStore, type ThemeName } from "../stores/theme-store.js";

const THEME_OPTIONS: { value: ThemeName; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "sepia", label: "Sepia" },
];

function SettingRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 hover:bg-[var(--bg-hover)] transition-colors">
      <div className="flex items-center gap-2 text-[13px] text-[var(--text-sidebar)]">
        <span className="text-[var(--text-secondary)]">{icon}</span>
        <span>{label}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}): React.ReactElement {
  return (
    <div className="flex rounded border border-[var(--border-sidebar)] overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`px-2 py-0.5 text-[12px] cursor-pointer transition-colors ${
            value === opt.value
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
          }`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsPanel(): React.ReactElement {
  const fontSize = useSettingsStore((s) => s.fontSize);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div className="pb-2">
      <div className="px-4 pt-2 pb-1 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
        Appearance
      </div>

      <SettingRow icon={<Palette size={14} />} label="Theme">
        <SegmentedControl
          options={THEME_OPTIONS}
          value={theme}
          onChange={setTheme}
        />
      </SettingRow>

      <SettingRow icon={<Type size={14} />} label="Font size">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={14}
            max={24}
            step={1}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-[80px] h-[4px] accent-[var(--accent)] cursor-pointer"
          />
          <span className="text-[12px] text-[var(--text-secondary)] w-[28px] text-right tabular-nums">
            {fontSize}px
          </span>
        </div>
      </SettingRow>
    </div>
  );
}
