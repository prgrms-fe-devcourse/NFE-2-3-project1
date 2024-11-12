import utils from './utils.js';

const { navigateTo } = utils;

const renderSidebar = (docs) => {
  const makeDocuments = (
    docs,
    parentsElement = document.getElementById('side-bar__nav-list')
  ) => {
    docs.forEach((doc) => {
      const listItem = document.createElement('li');
      const title = doc.title || '제목 없음';

      listItem.innerHTML = `
        <div class="flex">
          <img src="./assets/toggle-icon.svg" alt="토글 아이콘" class="toggle-icon" />
          <a href="${title}" class="doc-item" data-id="${doc.id}">${title}</a>
        </div>
      `;

      if (doc.documents && doc.documents.length > 0) {
        const subList = document.createElement('ul');
        subList.classList.add('indent');
        listItem.appendChild(subList);

        makeDocuments(doc.documents, subList);
      }

      parentsElement.appendChild(listItem);
    });
  };

  const addDocClickListener = () => {
    const docItems = document.querySelectorAll('.doc-item');
    console.log(`문서 항목들 : `, docItems);

    docItems.forEach((item) => {
      item.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = e.target.dataset.id;
        const pathname = new URL(e.currentTarget.href).pathname;
        navigateTo({ id }, pathname);

        console.log(`클릭한 문서 ID : `, id);
      });
    });
  };

  const navListEl = document.getElementById('side-bar__nav-list');
  if (navListEl.childElementCount === 0) {
    makeDocuments(docs);
    addDocClickListener();
  }
};

export default renderSidebar;

// 새 페이지 생성
document.addEventListener('DOMContentLoaded', function () {
  // 이벤트 리스너
  const button = document.getElementById('new-page__button');

  if (button) {
    button.addEventListener('click', async function (e) {
      e.preventDefault();
      console.log('새 페이지 버튼이 클릭되었습니다!');
      const parentId = history.state.id;
      await createNewPage(parentId);
    });
  } else {
    console.log('버튼을 찾을 수 없습니다.');
  }
});
// api입력
async function createNewPage(parentId) {
  try {
    const response = await fetch('https://kdt-api.fe.dev-cos.com/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': 'potatoes',
      },
      body: JSON.stringify({
        title: '새 페이지',
        content: '',
        parent: parentId, // parentId 추가
      }),
    });
    if (!response.ok) {
      alert('새 페이지 생성에 실패했습니다. 다시 시도해주세요.');
      throw new Error('새 페이지 생성에 실패했습니다.');
    }
    const newPageData = await response.json();
    console.log('API 응답 데이터:', newPageData);
  } catch (error) {
    console.error('페이지 생성 중 오류 발생:', error);
    alert('페이지 생성 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.');
  }
}
