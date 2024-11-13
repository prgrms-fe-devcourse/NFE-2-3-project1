import { getTargetContent } from "../api/api.js";
import { navigate } from "../router/router.js";

// breadcrumb 업데이트 함수
export const updateBreadcrumb = async (docId) => {
  const breadcrumb = document.getElementById("breadCrumb");
  if (!breadcrumb || !docId) {
    breadcrumb.innerHTML = '문서';
    return;
  }

  try {
    // 현재 문서 정보 가져오기
    const currentDoc = await getTargetContent(docId);
    if (!currentDoc) return;

    const breadcrumbParts = [];
    let currentParent = currentDoc;

    // 상위 문서들을 순차적으로 가져와서 경로 구성
    while (currentParent) {
      breadcrumbParts.unshift(`
        <span class="breadcrumb-item" data-document-id="${currentParent.id}">
          ${currentParent.title}
        </span>
      `);
      
      if (currentParent.parent) {
        currentParent = await getTargetContent(currentParent.parent);
        if (currentParent) {
          breadcrumbParts.unshift(' / ');
        }
      } else {
        break;
      }
    }

    // 최상위 경로 추가
    breadcrumbParts.unshift(`
      <span class="breadcrumb-item" data-document-id="root">
        문서
      </span> / `
    );

    breadcrumb.innerHTML = breadcrumbParts.join('');
    addBreadcrumbClickEvents();

  } catch (error) {
    console.error('Breadcrumb 업데이트 실패:', error);
    breadcrumb.innerHTML = '문서';
  }
};

// breadcrumb 클릭 이벤트 추가
const addBreadcrumbClickEvents = () => {
  document.querySelectorAll('.breadcrumb-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const docId = e.target.dataset.documentId;
      if (docId && docId !== 'root') {
        navigate(`/documents/${docId}`);
      } else {
        navigate('/documents');
      }
    });
  });
};

// 초기화 함수
export const initializeBreadcrumb = () => {
  const currentPath = window.location.pathname;
  const docId = currentPath.split('/documents/')[1];
  
  if (currentPath === '/documents') {
    // 랜딩 페이지인 경우
    const breadcrumb = document.getElementById("breadCrumb");
    if (breadcrumb) {
      breadcrumb.innerHTML = '문서';
    }
  } else if (docId) {
    // 특정 문서 페이지인 경우
    updateBreadcrumb(docId);
  }
};