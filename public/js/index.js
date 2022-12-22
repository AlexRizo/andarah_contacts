const tableRow = document.querySelectorAll('.table-row');

let ir = 0;

for (const row of tableRow) {
    ir++

    if ((ir % 2) === 0) {
        row.style.background = '#EEEEEE'
    }
}