#include "../Native/src/DerbyPrizePolicy.h"
#include <iostream>
int main()
{
    using Starcade::Derby::PrizeFor;
    if (PrizeFor(0,0) || PrizeFor(-1,0) || PrizeFor(8000001,0) || PrizeFor(1,3) || PrizeFor(8,0) || PrizeFor(8,9)) return 1;
    for (int ordinal : {1,7,8,9,16,8000000}) {
        const int max = ordinal % 8 ? 2 : 8;
        for (int result = ordinal % 8 ? 0 : 1; result <= max; ++result) {
            const auto p = PrizeFor(ordinal,result);
            if (!p) return 2;
            std::cout << ordinal << ',' << result << ',' << p->credits << ',' << p->medpacks << '\n';
        }
    }
}
