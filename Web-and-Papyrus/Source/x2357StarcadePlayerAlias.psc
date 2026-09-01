ScriptName x2357StarcadePlayerAlias Extends ReferenceAlias

; Attach this script to the PlayerAlias on x2357StarcadeStartupQuest.
; Fill StarcadePad with the x2357StarcadePad Aid record in the CK.

Form Property StarcadePad Auto Const Mandatory

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
