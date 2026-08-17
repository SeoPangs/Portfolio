# 이전 디자인 그대로 + JSON 데이터 관리 버전

이 버전은 이전에 전달한 상세페이지 포트폴리오의 `style.css`를 그대로 사용합니다.
레이아웃/색상/반응형/애니메이션 디자인은 이전 버전과 동일하고, 프로젝트 데이터만 `projects.json`에서 관리합니다.

## 주로 수정할 파일
`projects.json`

여기서 프로젝트의 제목, 설명, 기술 스택, 핵심 구현, 문제 해결, 링크 등을 수정하면:
- 메인 페이지 프로젝트 카드
- 프로젝트 상세 페이지

두 곳에 함께 반영됩니다.

## 상세 페이지 주소
`project.html?id=action-rpg`
`project.html?id=board-game`
`project.html?id=mobile-controller`

## 새 프로젝트 추가
`projects.json`의 `projects` 배열에 기존 항목을 복사해 추가하고 `id`, `number`, `imageClass` 등을 바꾸면 됩니다. 별도 상세 HTML 파일은 만들 필요가 없습니다.

## 실행
JSON은 `fetch()`로 불러오므로 HTML 파일을 직접 더블클릭하지 말고 로컬 서버를 사용하세요.

```bash
python -m http.server 8000
```

그 다음 `http://localhost:8000` 으로 접속합니다. VS Code Live Server도 사용할 수 있습니다.
