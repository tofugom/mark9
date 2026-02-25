import React from "react";
import {
  Save,
  Type,
  Indent,
  WrapText,
  Hash,
} from "lucide-react";
import { useSettingsStore } from "../stores/settings-store.js";
import type { AutoSaveInterval } from "../stores/settings-store.js";

const AUTO_SAVE_OPTIONS: { value: AutoSaveInterval; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "1s", label: "1s" },
  { value: "5s", label: "5s" },
  { value: "30s", label: "30s" },
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

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
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

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}): React.ReactElement {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`relative w-[36px] h-[20px] rounded-full transition-colors cursor-pointer ${
        checked ? "bg-[var(--accent)]" : "bg-[var(--border-sidebar)]"
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white transition-transform ${
          checked ? "left-[18px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}

export function SettingsPanel(): React.ReactElement {
  const autoSave = useSettingsStore((s) => s.autoSave);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const tabSize = useSettingsStore((s) => s.tabSize);
  const wordWrap = useSettingsStore((s) => s.wordWrap);
  const showLineNumbers = useSettingsStore((s) => s.showLineNumbers);

  const setAutoSave = useSettingsStore((s) => s.setAutoSave);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const setTabSize = useSettingsStore((s) => s.setTabSize);
  const setWordWrap = useSettingsStore((s) => s.setWordWrap);
  const setShowLineNumbers = useSettingsStore((s) => s.setShowLineNumbers);

  return (
    <div className="pb-2">
      {/* Section: Editor */}
      <div className="px-4 pt-2 pb-1 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
        Editor
      </div>

      <SettingRow icon={<Save size={14} />} label="Auto-save">
        <SegmentedControl
          options={AUTO_SAVE_OPTIONS}
          value={autoSave}
          onChange={(v) => setAutoSave(v as AutoSaveInterval)}
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

      <SettingRow icon={<Indent size={14} />} label="Tab size">
        <SegmentedControl
          options={[
            { value: "2", label: "2" },
            { value: "4", label: "4" },
          ]}
          value={String(tabSize)}
          onChange={(v) => setTabSize(Number(v))}
        />
      </SettingRow>

      <SettingRow icon={<WrapText size={14} />} label="Word wrap">
        <Toggle checked={wordWrap} onChange={setWordWrap} />
      </SettingRow>

      <SettingRow icon={<Hash size={14} />} label="Line numbers">
        <Toggle checked={showLineNumbers} onChange={setShowLineNumbers} />
      </SettingRow>
    </div>
  );
}
