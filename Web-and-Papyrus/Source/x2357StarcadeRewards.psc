ScriptName x2357StarcadeRewards Hidden

; Property-free static bridge used by the native Starcade score service.
; Game.RewardPlayerXP presents the standard Starfield XP notification and
; participates in normal character progression.
Function AwardXP(int amount) Global
    If amount > 0
        Game.RewardPlayerXP(amount, false)
        x2357StarcadeNative.ReportXPResult(amount)
    EndIf
EndFunction
