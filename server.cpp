#include "httplib.h"
#include "solver.h"
#include <iostream>
#include <string>
using namespace httplib;

int main() {
    Server svr;

    svr.Post("/solve", [](const Request& req, Response& res) {
        int g[9][9];
        auto body = req.body;
        int idx = 0;

        for (char c : body)
            if ((c >= '0' && c <= '9') || c == ',')
                if (c != ',')
                    g[idx / 9][idx % 9] = c - '0', idx++;

        solve(g);

        std::string out = "[";
        for (int i = 0; i < 9; i++) {
            out += "[";
            for (int j = 0; j < 9; j++) {
                out += std::to_string(g[i][j]);
                if (j != 8) out += ",";
            }
            out += "]";
            if (i != 8) out += ",";
        }
        out += "]";

        res.set_content(out, "application/json");
    });

    svr.set_base_dir("docs");
    std::cout << "Server started on http://localhost:8080\n";
    svr.listen("0.0.0.0", 8080);
}
