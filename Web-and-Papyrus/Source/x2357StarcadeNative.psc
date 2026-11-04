ScriptName x2357StarcadeNative Native Hidden

; Implemented by Starcade.dll. Called only by x2357StarcadeCredits after the
; game inventory operation has completed.
Function ReportCreditResult(string requestId, bool success, int balance, string errorMessage) Global Native

; Confirms that the Papyrus XP award call ran so the OSFUI view can show
; feedback even while Starfield's normal HUD notification is obscured.
Function ReportXPResult(int amount) Global Native

; Derby status: 0 unavailable, 1 granted, 2 already recorded/query, 3 uncertain.
Function ReportDerbyPrize(string requestId, int status, int frontier, int credits, int medpacks, string message) Global Native
