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
        AddProjectCard(list, item);
    });
}

//프로젝트 Card
function AddProjectCard(from, name) {
    //프로젝트 하나를 담는 컨테이너를 추가(제목, 박스 등)
    ProjectContainer = document.createElement('div');
    ProjectContainer.className = 'container';
    ProjectContainer.textContent = name;
    from.appendChild(ProjectContainer)

    BoxCard = document.createElement('div');
    BoxCard.className = 'box'
    ProjectContainer.appendChild(BoxCard);
    
}