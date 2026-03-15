import { useTheme } from '../themes/ThemeContext';
import { themes, themeIds } from '../themes';

export function ThemeSelector() {
  const { themeId, setTheme, theme } = useTheme();

  return (
    <div className="flex items-center gap-1.5">
      {themeIds.map((id) => {
        const t = themes[id];
        const active = id === themeId;
        return (
          <button
            key={id}
            onClick={() => setTheme(id)}
            title={t.description}
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              backgroundColor: active ? theme.ui.accent : theme.ui.surfaceAlt,
              color: active ? theme.ui.buttonText : theme.ui.textMuted,
              border: `1px solid ${active ? theme.ui.accent : theme.ui.border}`,
            }}
          >
            {t.name}
          </button>
        );
      })}
    </div>
  );
}
