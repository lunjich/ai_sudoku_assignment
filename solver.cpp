bool valid(int g[9][9], int r, int c, int v) {
    for (int i = 0; i < 9; i++) {
        if (g[r][i] == v) return false;
        if (g[i][c] == v) return false;
    }
    int sr = r - r % 3, sc = c - c % 3;
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (g[sr + i][sc + j] == v) return false;
    return true;
}

bool solve(int g[9][9]) {
    for (int r = 0; r < 9; r++)
        for (int c = 0; c < 9; c++)
            if (g[r][c] == 0) {
                for (int v = 1; v <= 9; v++) {
                    if (valid(g, r, c, v)) {
                        g[r][c] = v;
                        if (solve(g)) return true;
                        g[r][c] = 0;
                    }
                }
                return false;
            }
    return true;
}
