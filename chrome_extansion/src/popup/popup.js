document.addEventListener('DOMContentLoaded', function() {
  const adobeBtn = document.getElementById('adobeBtn');
  const shutterstockBtn = document.getElementById('shutterstockBtn');
  
  // Adobe Stock 대시보드로 이동
  adobeBtn.addEventListener('click', function() {
    chrome.tabs.create({
      url: 'https://contributor.stock.adobe.com/kr/portfolio'
    });
    window.close();
  });
  
  // Shutterstock 업로드 포트폴리오로 이동
  shutterstockBtn.addEventListener('click', function() {
    chrome.tabs.create({
      url: 'https://submit.shutterstock.com/ko/portfolio/not_submitted/photo'
    });
    window.close();
  });
}); 