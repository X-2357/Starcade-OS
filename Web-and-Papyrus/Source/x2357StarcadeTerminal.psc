ScriptName x2357StarcadeTerminal Extends ObjectReference

; Attach only to a dedicated Starcade terminal/activator reference. Do not
; attach this to quest terminals or references with required activation logic.

Event OnInit()
    BlockActivation(true, false)
EndEvent

Event OnLoad()
    BlockActivation(true, false)
EndEvent

Event OnActivate(ObjectReference akActionRef)
    If akActionRef == Game.GetPlayer()
        OSFUI_View.Open("starcade.arcade/launcher")
    EndIf
EndEvent

