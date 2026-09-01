ScriptName x2357StarcadeCredits Hidden

Function ProcessTransaction(string requestId, int delta) Global
    Actor player = Game.GetPlayer()
    ; Vanilla Credits [MISC:0000000F]. Resolving from Starfield.esm keeps this
    ; service property-free and compatible with existing 1.2.0 saves.
    Form credits = Game.GetFormFromFile(0x0000000F, "Starfield.esm")
    If player == None || credits == None
        x2357StarcadeNative.ReportCreditResult(requestId, false, 0, "Credit form unavailable")
        Return
    EndIf

    int balance = player.GetItemCount(credits)
    If delta < 0
        int wager = 0 - delta
        If wager <= 0 || balance < wager
            x2357StarcadeNative.ReportCreditResult(requestId, false, balance, "Insufficient credits")
            Return
        EndIf
        player.RemoveItem(credits, wager, true)
    ElseIf delta > 0
        player.AddItem(credits, delta, true)
    EndIf

    balance = player.GetItemCount(credits)
    x2357StarcadeNative.ReportCreditResult(requestId, true, balance, "")
EndFunction
