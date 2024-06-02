function updateList() {
    console.log("updateList");
    const select = document.getElementById('options');
    const list = document.getElementById('projectlist');

    // Clear existing list items
    list.innerHTML = '';
    // Get the selected option's value
    const selectedValue = select.value;
    console.log(selectedValue);
    GenerateCardByJSON(list, selectedValue);
}

/**
 * 프로젝트 카드를 추가한다.
 * @param {HTMLElement} from 
 * @param {string} item 
 */
function AddProjectCard(from, item) {
    console.log("AddProjectCard");
    //프로젝트 하나를 담는 컨테이너를 추가(제목, 박스 등)
    ProjectContainer = document.createElement('div');
    ProjectContainer.className = 'container';
   
    //글자수가 많을 경우 줄바꿈할 수 있게.
    if(item.title.length > 15) {
        NameDiv = document.createElement('div');
        NameDiv.style.fontSize = '20px';
        NameDiv.style.width = '371px';
        NameDiv.textContent = item.title;
        NameDiv.appendChild(document.createElement('br'));
        ProjectContainer.appendChild(NameDiv);
    } else {
        ProjectContainer.textContent = item.title;
    }
    from.appendChild(ProjectContainer)

    //회색 박스 부분 추가
    BoxCard = document.createElement('div');
    BoxCard.className = 'box'
    ProjectContainer.appendChild(BoxCard);

    //썸네일 제작
    Image = document.createElement('img');
    Image.src = item.image_src;
    BoxCard.appendChild(Image);

    //박스 안 부분 내용 추가
    BoxContent = document.createElement('content');
    BoxContent.textContent = '[' + item.purpose +']' ;
    BoxContent.appendChild(document.createElement('br'));

    //BoxContent.textContent += ( ' '+ item.explanation);
    BoxCard.appendChild(BoxContent);
    item.tags.forEach(tag => {
        badge = null;
        //console.log(tag);
        //BoxContent.appendChild(CreateStaticBadge(tag));
        
        if(badge = CreateStaticBadge(tag)) {
            BoxContent.appendChild(badge);
        }
        
        
    });

    ///ToDo: 박스 클릭 이벤트 할당하기
}

/**
 * JSON을 통해 카드를 생성하는 함수
 * @param {HTMLElement} list 
 * @param {string} tag_name 
 */
function GenerateCardByJSON(list, tag_name)
{
    console.log('GenerateCardByJSON');
    fetch('../Project/ProjectList.json')
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)){
            if(tag_name=='null'){
                data.forEach(item => {
                    AddProjectCard(list, item);
                });
            } else {
                const filteredItems = data.filter(item => item.tags && item.tags.includes(tag_name));
                filteredItems.forEach(item => {
                    AddProjectCard(list, item);
                    //console.log(item.title); // 각 항목 출력
                });
            }
        
    } else {
        console.log("Data is Not Array.")
    }

    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });
}

function CreateStaticBadge(badgeTag)
{
    badge_image_src = "";
    switch (badgeTag)
    {
        case 'Unity':
            badge_image_src = "https://img.shields.io/badge/Unity-gray?style=for-the-badge&logo=unity&logoColor=white";
            break;
        case 'C#':
            badge_image_src = "https://img.shields.io/badge/C%23-567812?style=for-the-badge&logo=C%23";
            break;
        case 'UnrealEngine':
            badge_image_src = "https://img.shields.io/badge/Unreal%20Engine-black?style=for-the-badge&logo=unrealengine&logoColor=white";
            break;
        case 'C++':
            badge_image_src = "https://img.shields.io/badge/C%2B%2B-blue?style=for-the-badge&logo=C%2B%2B";
            break;
        default:
            console.log("WhyNull: " + badgeTag);
            return null;
    };
    const badge = document.createElement('img');
    badge.src = badge_image_src;
    return badge;
}