let database = JSON.parse(localStorage.getItem('mySystemDB')) || {
    employees: [],
    inventory: []
};

let currentCategory = "";
let editIndex = -1; // -1 means adding, any other number means editing

updateStats();

function shortcutCategory(cat) {
    document.getElementById("catSelect").value = cat;
    changeCategory(cat);
}

function changeCategory(category) {
    currentCategory = category;
    const fs = document.getElementById("form-section");
    const ts = document.getElementById("table-section");
    const msg = document.getElementById("message");

    if (!category) {
        fs.style.display = "none";
        ts.style.display = "none";
        msg.innerText = "Select a category to start.";
        return;
    }

    cancelEdit(); // Reset form when switching categories
    fs.style.display = "block";
    ts.style.display = "block";
    msg.innerText = "";
    updateLabels();
    renderTable();
}

function updateLabels() {
    const l1 = document.getElementById("label-1"), l2 = document.getElementById("label-2"), l3 = document.getElementById("label-3");
    if (currentCategory === "employees") {
        l1.innerText = "ID Number:"; l2.innerText = "Full Name:"; l3.innerText = "Position:";
    } else {
        l1.innerText = "Item Code:"; l2.innerText = "Item Name:"; l3.innerText = "Stock Count:";
    }
}

function addData() {
    const v1 = document.getElementById("input-1").value;
    const v2 = document.getElementById("input-2").value;
    const v3 = document.getElementById("input-3").value;

    if (!v1 || !v2 || !v3) return alert("Fill up all fields!");

    if (editIndex === -1) {
        // ADD NEW
        database[currentCategory].push({ f1: v1, f2: v2, f3: v3 });
    } else {
        // UPDATE EXISTING
        database[currentCategory][editIndex] = { f1: v1, f2: v2, f3: v3 };
        cancelEdit();
    }

    saveAndRefresh();
    clearInputs();
}

function editData(index) {
    editIndex = index;
    const item = database[currentCategory][index];
    
    document.getElementById("input-1").value = item.f1;
    document.getElementById("input-2").value = item.f2;
    document.getElementById("input-3").value = item.f3;

    document.getElementById("form-title").innerText = "Edit Entry";
    document.getElementById("save-btn").innerText = "Update Entry";
    document.getElementById("cancel-btn").style.display = "block";
    
    window.scrollTo({ top: 100, behavior: 'smooth' });
}

function cancelEdit() {
    editIndex = -1;
    clearInputs();
    document.getElementById("form-title").innerText = "Add New Entry";
    document.getElementById("save-btn").innerText = "Save to Database";
    document.getElementById("cancel-btn").style.display = "none";
}

function deleteData(index) {
    if (confirm("Delete this entry?")) {
        database[currentCategory].splice(index, 1);
        if (editIndex === index) cancelEdit();
        saveAndRefresh();
    }
}

function clearInputs() {
    document.getElementById("input-1").value = "";
    document.getElementById("input-2").value = "";
    document.getElementById("input-3").value = "";
}

function saveAndRefresh() {
    localStorage.setItem('mySystemDB', JSON.stringify(database));
    renderTable();
    updateStats();
}

function updateStats() {
    document.getElementById("count-employees").innerText = database.employees.length;
    document.getElementById("count-inventory").innerText = database.inventory.length;
}

function renderTable() {
    const th = document.getElementById("table-head"), tb = document.getElementById("table-body"), list = database[currentCategory];
    th.innerHTML = currentCategory === "employees" ? "<tr><th>ID</th><th>NAME</th><th>POSITION</th><th>ACTION</th></tr>" : "<tr><th>CODE</th><th>ITEM</th><th>STOCK</th><th>ACTION</th></tr>";
    tb.innerHTML = "";
    list.forEach((item, index) => {
        tb.innerHTML += `<tr><td>${item.f1}</td><td>${item.f2}</td><td>${item.f3}</td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editData(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteData(${index})">Delete</button>
                </div>
            </td></tr>`;
    });
}

async function importFromJSON() {
    if (!currentCategory) return alert("Select Category!");
    try {
        const res = await fetch('data.json');
        const d = await res.json();
        database[currentCategory] = database[currentCategory].concat(d[currentCategory]);
        saveAndRefresh();
    } catch (e) { alert("Error: Use Live Server!"); }
}

function exportToExcel() {
    if (!currentCategory || database[currentCategory].length === 0) return alert("No data!");
    let csv = currentCategory === "employees" ? "ID,NAME,POSITION\n" : "CODE,ITEM,STOCK\n";
    database[currentCategory].forEach(i => { csv += `${i.f1},${i.f2},${i.f3}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${currentCategory}_report.csv`; a.click();
}