ScriptName x2357StarcadeLaunchEffect Extends ActiveMagicEffect

; Attach to the x2357StarcadeLaunchEffect magic-effect record. The portable
; Aid item applies that effect to the player when used from inventory.

Event OnEffectStart(ObjectReference akTarget, Actor akCaster, MagicEffect akBaseEffect, float afMagnitude, float afDuration)
    If akTarget == Game.GetPlayer()
        OSFUI.OpenMenu("starcade.arcade/launcher")

        ; The CK record is an Aid item, so Starfield consumes one on use. Restore
        ; the same master-file form immediately to make the Starcade Pad reusable.
        Form StarcadePad = Game.GetFormFromFile(0x00000806, "x2357starcade.esm")
        If StarcadePad
            akTarget.AddItem(StarcadePad, 1, true)
        EndIf
    EndIf
EndEvent
