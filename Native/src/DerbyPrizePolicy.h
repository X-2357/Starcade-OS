#pragma once
#include <cstdint>
#include <optional>

namespace Starcade::Derby
{
    struct Prize { std::int32_t credits; std::int32_t medpacks; };
    // Outcome: 0 loss, 1 draw, 2 win; season prize uses sporting rank 1..8.
    inline std::optional<Prize> PrizeFor(std::int32_t ordinal, std::int32_t result)
    {
        if (ordinal < 1 || ordinal > 8000000) return std::nullopt;
        if (ordinal % 8 == 0) {
            if (result < 1 || result > 8) return std::nullopt;
            return Prize{result == 1 ? 500 : result == 2 ? 300 : result == 3 ? 150 : 100,
                         result == 1 ? 3 : result == 2 ? 2 : 1};
        }
        if (result < 0 || result > 2) return std::nullopt;
        return Prize{100 + result * 50, 0};
    }
}
