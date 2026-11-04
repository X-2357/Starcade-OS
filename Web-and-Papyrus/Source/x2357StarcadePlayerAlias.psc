ScriptName x2357StarcadePlayerAlias Extends ReferenceAlias

; Attach this script to the PlayerAlias on x2357StarcadeStartupQuest.
; Fill StarcadePad with the x2357StarcadePad Aid record in the CK.

Form Property StarcadePad Auto Const Mandatory

; Save-bound, never reset on load. No new CK properties or quest records.
Guard DerbyPrizeGuard ProtectsFunctionLogic
string[] derbyPassports
int[] derbyFrontiers
int[] derbyStatuses

Function ProcessDerbyPrize(string requestId, string passport, int ordinal, int credits, int medpacks, int expectedFrontier)
    LockGuard DerbyPrizeGuard
        ProcessDerbyPrizeLocked(requestId, passport, ordinal, credits, medpacks, expectedFrontier)
    EndLockGuard
EndFunction

Function ProcessDerbyPrizeLocked(string requestId, string passport, int ordinal, int credits, int medpacks, int expectedFrontier)
    If passport == "" || ordinal < 0 || ordinal > 8000000 || credits < 0 || credits > 500 || medpacks < 0 || medpacks > 3 || expectedFrontier < 0 || expectedFrontier > 8000000
        x2357StarcadeNative.ReportDerbyPrize(requestId, 0, 0, 0, 0, "Invalid prize parameters")
        Return
    EndIf
    If derbyPassports == None && derbyFrontiers == None && derbyStatuses == None
        derbyPassports = new string[0]
        derbyFrontiers = new int[0]
        derbyStatuses = new int[0]
    EndIf
    If derbyPassports == None || derbyFrontiers == None || derbyStatuses == None || derbyPassports.Length != derbyFrontiers.Length || derbyPassports.Length != derbyStatuses.Length
        x2357StarcadeNative.ReportDerbyPrize(requestId, 0, 0, 0, 0, "Prize ledger unavailable; no inventory changed")
        Return
    EndIf
    int slot = derbyPassports.Find(passport)
    If ordinal == 0
        If slot < 0
            x2357StarcadeNative.ReportDerbyPrize(requestId, 2, 0, 0, 0, "No prizes claimed for this career in this save")
        Else
            x2357StarcadeNative.ReportDerbyPrize(requestId, derbyStatuses[slot], derbyFrontiers[slot], 0, 0, "Prize ledger read from the current Starfield save")
        EndIf
        Return
    EndIf
    If slot >= 0
        If derbyStatuses[slot] == 3
            x2357StarcadeNative.ReportDerbyPrize(requestId, 3, derbyFrontiers[slot], 0, 0, "Earlier prize delivery uncertain; check inventory before further claims")
            Return
        ElseIf ordinal <= derbyFrontiers[slot]
            x2357StarcadeNative.ReportDerbyPrize(requestId, 2, derbyFrontiers[slot], 0, 0, "Prize already recorded; nothing added")
            Return
        EndIf
    EndIf
    int actualFrontier = 0
    If slot >= 0
        actualFrontier = derbyFrontiers[slot]
    EndIf
    If expectedFrontier != actualFrontier
        x2357StarcadeNative.ReportDerbyPrize(requestId, 2, actualFrontier, 0, 0, "Current save ledger changed; nothing added. Review the next prize")
        Return
    EndIf
    Actor player = GetActorReference()
    Form money = Game.GetFormFromFile(0x0000000F, "Starfield.esm")
    Form pack = Game.GetFormFromFile(0x0000ABF9, "Starfield.esm")
    If player == None || player != Game.GetPlayer() || player.IsDead() || money == None || pack == None
        x2357StarcadeNative.ReportDerbyPrize(requestId, 0, 0, 0, 0, "Living player or vanilla reward forms unavailable")
        Return
    EndIf
    int beforeMoney = player.GetItemCount(money)
    int beforePacks = player.GetItemCount(pack)
    If beforeMoney < 0 || beforeMoney > 2147483000 || beforePacks < 0 || beforePacks > 2147483000
        x2357StarcadeNative.ReportDerbyPrize(requestId, 0, 0, 0, 0, "Inventory count outside safe prize range")
        Return
    EndIf
    If slot < 0
        If derbyPassports.Length >= 128
            x2357StarcadeNative.ReportDerbyPrize(requestId, 0, 0, 0, 0, "128-career claim capacity reached; old claims retained")
            Return
        EndIf
        slot = derbyPassports.Length
        derbyPassports.Add(passport)
        derbyFrontiers.Add(0)
        derbyStatuses.Add(2)
    EndIf
    ; Reserve before AddItem: an uncertain operation must never auto-pay again.
    derbyFrontiers[slot] = ordinal
    derbyStatuses[slot] = 3
    If credits > 0
        player.AddItem(money, credits, true)
    EndIf
    If medpacks > 0
        player.AddItem(pack, medpacks, true)
    EndIf
    If player.GetItemCount(money) == beforeMoney + credits && player.GetItemCount(pack) == beforePacks + medpacks
        derbyStatuses[slot] = 1
        x2357StarcadeNative.ReportDerbyPrize(requestId, 1, ordinal, credits, medpacks, "Prize added to player inventory")
    Else
        x2357StarcadeNative.ReportDerbyPrize(requestId, 3, ordinal, 0, 0, "Inventory delta could not be confirmed; prize reserved, do not re-grant")
    EndIf
EndFunction

Event OnInit()
    GiveStarcadePad()
EndEvent

Event OnPlayerLoadGame()
    GiveStarcadePad()
EndEvent

Function GiveStarcadePad()
    Actor Player = GetActorReference()

    If !Player
        Player = Game.GetPlayer()
    EndIf

    If Player && StarcadePad && Player.GetItemCount(StarcadePad) < 1
        Player.AddItem(StarcadePad, 1, true)
    EndIf
EndFunction
