const SoundName = {
    MainTheme: "main_theme",
    BattleTheme: "battle_theme",
    Jump: "jump",
    Punch: "punch",
    Hit: "hit",
    PowerUp: "power_up",
    Kamehameha: "kamehameha",
    FinalFlash: "final_flash",
    GokuWin: "goku_win",
    VegetaWin: "vegeta_win",
} as const;

export type SoundName = typeof SoundName[keyof typeof SoundName];

export default SoundName;
