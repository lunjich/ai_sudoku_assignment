### For Mac:
1. open terminal
2. type command: git clone https://github.com/lunjich/ai_sudoku_assignment.git
3. type command: cd ai_sudoku_assignment
4. type command: clang++ -std=c++17 server.cpp solver.cpp -o server
5. type command: ./server



### For Windows:
The setup steps are the same as macOS, but the compilation command differs.

Prerequisites
•  ⁠Install *G++ (MinGW-w64)*.
•⁠  ⁠Add the ⁠ MinGW-w64\usr\bin ⁠ directory to your system *PATH* so that the ⁠ g++ ⁠ command is available in the terminal.

Compilation
Run the following command in the project directory:
bash
g++ -std=c++17 server.cpp solver.cpp -o server.exe -I. -DUNICODE -D_UNICODE -lws2_32
: Execution

After successful compilation, run:
./server.exe
