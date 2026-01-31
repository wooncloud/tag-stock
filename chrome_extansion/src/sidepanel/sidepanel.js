// Side Panel Script for TagStock

const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const fillBtn = document.getElementById('fillBtn');
const btnIcon = document.getElementById('btnIcon');
const btnText = document.getElementById('btnText');
const btnSpinner = document.getElementById('btnSpinner');
const adobeBtn = document.getElementById('adobeBtn');
const shutterstockBtn = document.getElementById('shutterstockBtn');
const homeBtn = document.getElementById('homeBtn');
const contactBtn = document.getElementById('contactBtn');
const logSection = document.getElementById('logSection');

let currentTabId = null;
let currentSiteType = null;

// 로그 추가
function addLog(message, type = 'info') {
  const entry = document.createElement('div');

  const colors = {
    info: 'text-muted-foreground',
    success: 'text-green-600',
    error: 'text-red-600'
  };

  entry.className = colors[type] || colors.info;
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logSection.appendChild(entry);
  logSection.scrollTop = logSection.scrollHeight;

  // 최대 20개 로그 유지
  while (logSection.children.length > 20) {
    logSection.removeChild(logSection.firstChild);
  }
}

// 상태 업데이트
function updateStatus(connected, site, info = '') {
  if (connected) {
    statusBadge.className = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-600';
    statusBadge.textContent = site;
    statusText.textContent = info || 'Ready to fill metadata';
    fillBtn.disabled = false;
    currentSiteType = site.toLowerCase().includes('adobe') ? 'adobe' : 'shutterstock';
  } else {
    statusBadge.className = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground';
    statusBadge.textContent = 'Not Connected';
    statusText.textContent = info || 'Navigate to Adobe Stock or Shutterstock upload page';
    fillBtn.disabled = true;
    currentSiteType = null;
  }
}

// 버튼 로딩 상태
function setButtonLoading(loading) {
  if (loading) {
    btnIcon.classList.add('hidden');
    btnSpinner.classList.remove('hidden');
    btnText.textContent = 'Generating...';
    fillBtn.disabled = true;
  } else {
    btnIcon.classList.remove('hidden');
    btnSpinner.classList.add('hidden');
    btnText.textContent = 'Fill Metadata';
    fillBtn.disabled = false;
  }
}

// 버튼 성공 상태
function setButtonSuccess() {
  btnIcon.classList.remove('hidden');
  btnSpinner.classList.add('hidden');
  btnText.textContent = 'Done!';
  fillBtn.className = fillBtn.className.replace('bg-primary', 'bg-green-600');

  setTimeout(() => {
    btnText.textContent = 'Fill Metadata';
    fillBtn.className = fillBtn.className.replace('bg-green-600', 'bg-primary');
  }, 2000);
}

// 버튼 에러 상태
function setButtonError() {
  btnIcon.classList.remove('hidden');
  btnSpinner.classList.add('hidden');
  btnText.textContent = 'Error';
  fillBtn.className = fillBtn.className.replace('bg-primary', 'bg-red-600');
  fillBtn.disabled = false;

  setTimeout(() => {
    btnText.textContent = 'Fill Metadata';
    fillBtn.className = fillBtn.className.replace('bg-red-600', 'bg-primary');
  }, 2000);
}

// 현재 탭 상태 확인
async function checkCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) {
      updateStatus(false, '', '');
      return;
    }

    currentTabId = tab.id;
    const url = tab.url || '';

    if (url.includes('contributor.stock.adobe.com') && url.includes('uploads')) {
      updateStatus(true, 'Adobe Stock', 'Upload page detected');
      addLog('Adobe Stock upload page detected');
    } else if (url.includes('submit.shutterstock.com')) {
      updateStatus(true, 'Shutterstock', 'Upload page detected');
      addLog('Shutterstock upload page detected');
    } else if (url.includes('adobe.com') || url.includes('shutterstock.com')) {
      updateStatus(false, '', 'Navigate to the upload page');
    } else {
      updateStatus(false, '', '');
    }
  } catch (error) {
    console.error('Error checking tab:', error);
    updateStatus(false, '', '');
  }
}

// Fill 버튼 클릭 처리
async function handleFillClick() {
  if (!currentTabId || !currentSiteType) {
    addLog('No valid page detected', 'error');
    return;
  }

  setButtonLoading(true);
  addLog('Starting AI metadata generation...');

  try {
    const response = await chrome.tabs.sendMessage(currentTabId, {
      action: 'generateMetadata',
      siteType: currentSiteType
    });

    setButtonLoading(false);

    if (response && response.success) {
      setButtonSuccess();
      addLog(`Metadata generated: "${response.title}"`, 'success');
    } else {
      throw new Error(response?.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Fill error:', error);
    setButtonLoading(false);
    setButtonError();
    addLog(`Error: ${error.message}`, 'error');
  }
}

// Header links
homeBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://tagstock.app/' });
});

contactBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://tagstock.app/contact' });
});

// Quick links
adobeBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://contributor.stock.adobe.com/kr/portfolio' });
});

shutterstockBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://submit.shutterstock.com/ko/portfolio/not_submitted/photo' });
});

// Fill 버튼 클릭
fillBtn.addEventListener('click', handleFillClick);

// 탭 변경 감지
chrome.tabs.onActivated.addListener(() => {
  checkCurrentTab();
});

// URL 변경 감지
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    checkCurrentTab();
  }
});

// Content script으로부터 메시지 수신
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'log') {
    addLog(message.text, message.level || 'info');
  } else if (message.type === 'status') {
    if (message.connected) {
      updateStatus(true, message.site, message.info);
    }
  }
});

// 초기화
checkCurrentTab();
addLog('TagStock side panel initialized');
