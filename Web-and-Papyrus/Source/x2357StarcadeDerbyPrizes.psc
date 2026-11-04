ScriptName x2357StarcadeDerbyPrizes Hidden

; Dedicated inventory service, not a casino wager. Quest/alias inspected in ESP.
Function ProcessPrize(string requestId, string passport, int ordinal, int credits, int medpacks, int expectedFrontier) Global
    Quest startup = Game.GetFormFromFile(0x00000809, "x2357starcade.esm") as Quest
    If startup == None || !startup.IsRunning()
        x2357StarcadeNative.ReportDerbyPrize(requestId, 0, 0, 0, 0, "Starcade startup quest unavailable")
        Return
    EndIf
    x2357StarcadePlayerAlias ledger = startup.GetAlias(0) as x2357StarcadePlayerAlias
    If ledger == None
        x2357StarcadeNative.ReportDerbyPrize(requestId, 0, 0, 0, 0, "Starcade player alias unavailable")
        Return
    EndIf
    ledger.ProcessDerbyPrize(requestId, passport, ordinal, credits, medpacks, expectedFrontier)
EndFunction
