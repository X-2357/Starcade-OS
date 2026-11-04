includes("../osf-ui/lib/commonlibsf")

set_project("Starcade")
    set_version("1.7.4")
set_license("GPL-3.0-or-later")
set_languages("c++23")
set_warnings("allextra")
add_rules("mode.debug", "mode.releasedbg")
add_requires("nlohmann_json")

target("Starcade")
    set_basename("Starcade")
    add_rules("commonlibsf.plugin", {
        name = "Starcade",
        author = "x2357",
        description = "Portable arcade framework for Starfield"
    })
    add_packages("nlohmann_json")
    add_files("src/**.cpp")
    add_headerfiles("src/**.h", "include/**.h")
    add_includedirs("src", "include")
    add_syslinks("shell32", "ole32", "advapi32")

target("DerbyPrizePolicyTest")
    set_kind("binary")
    set_default(false)
    add_files("../tests/derby-prize-policy.cpp")
