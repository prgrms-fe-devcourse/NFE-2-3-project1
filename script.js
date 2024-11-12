const BASE_URL = `https://kdt-api.fe.dev-cos.com/documents`;
const username = `potatoes`;

// 문서 목록을 가져옴
const fetchDocuments = async () => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'GET',
      headers: {
        'x-username': username,
      },
    });

    if (!response.ok) throw new Error(`문서 목록 요청 실패`);

    const data = await response.json();
    console.log(data);
    displayDocuments(data);
  } catch (error) {
    console.error(`문서 목록 요청 실패 : `, error);
  }
};

const displayDocuments = (
  documents,
  parentsElement = document.getElementById('side-bar__nav-list')
) => {
  documents.forEach((doc) => {
    const listItem = document.createElement('li');
    const title = doc.title || '제목 없음';

    listItem.innerHTML = `
      <div class="flex">
        <img src="./assets/toggle-icon.svg" alt="토글 아이콘" class="toggle-icon" />
        <a href="#" class="doc-item" data-id="${doc.id}">${title}</a>
      </div>
    `;

    if (doc.documents && doc.documents.length > 0) {
      const subList = document.createElement('ul');
      subList.classList.add('indent');
      listItem.appendChild(subList);
      displayDocuments(doc.documents, subList);
    }

    parentsElement.appendChild(listItem);
  });

  addDocClickListener();
};

const addDocClickListener = () => {
  const docItems = document.querySelectorAll('.doc-item');
  console.log(`문서 항목들 : `, docItems);

  docItems.forEach((item) => {
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      const docId = e.target.dataset.id;
      console.log(`클릭한 문서 ID : `, docId);

      const documentData = await fetchDocumentContent(docId);
      console.log(`클릭한 문서 내용 : `, documentData);
      displayDocumentContent(documentData);
    });
  });
};

const fetchDocumentContent = async (docId) => {
  try {
    const response = await fetch(`${BASE_URL}/${docId}`, {
      method: 'GET',
      headers: { 'x-username': username },
    });

    if (!response.ok) throw new Error('문서 내용을 불러오지 못했습니다.');

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('문서 내용 요청 실패:', error);
  }
};

const displayDocumentContent = (doc) => {
  const docTitleInput = document.getElementById('doc-title__input');
  const docContents = document.getElementById('doc-contents');

  if (!doc) {
    console.error('문서 내용이 존재하지 않습니다.');
    return;
  }

  // 문서 제목과 내용 표시
  docTitleInput.value = doc.title || '제목 없음';
  docContents.value = doc.content || '아름다운 글을 작성해보세요!!';
};

// 페이지 로드 후 문서 목록 가져오기
document.addEventListener('DOMContentLoaded', fetchDocuments);
