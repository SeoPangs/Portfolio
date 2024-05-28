function updateList() {
    const select = document.getElementById('options');
    const list = document.getElementById('project');

    // Clear existing list items
    list.innerHTML = '';

    // Get the selected option's value
    const selectedValue = select.value;

    // Define items for each category
    const items = {
        Unity: ['Light Up Life', '꿀벌 시뮬레이션', '흔들커피'],
        Unreal: ['Drive By Draw', '귤러가유', '별의 유랑', 'The Skilled'],
        Etc: ['U2U'],
    };

    // Get the items for the selected category
    const selectedItems = items[selectedValue];

    // Create and append list items
    selectedItems.forEach(item => {
        AddCard(list, item);
    });
}

function AddCard(from, name) {
    a = document.createElement('div');
    a.className = 'container';
    a.textContent = name;
    from.appendChild(a)

    b = document.createElement('div');
    b.className = 'box'
    a.appendChild(b);
    
}