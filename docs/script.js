window.onload = () => {
    let b = document.getElementById("board");
    for (let i = 0; i < 9; i++) {
        let row = "<tr>";
        for (let j = 0; j < 9; j++)
            row += `<td><input id="c${i}${j}" maxlength="1"></td>`;
        row += "</tr>";
        b.innerHTML += row;
    }
};

function solveSudoku() {
    let data = [];
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++) {
            let v = document.getElementById(`c${i}${j}`).value;
            data.push(v ? parseInt(v) : 0);
        }

    fetch("/solve", {
        method: "POST",
        body: data.toString()
    })
    .then(r => r.json())
    .then(sol => {
        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++)
                document.getElementById(`c${i}${j}`).value = sol[i][j];
    });
}
