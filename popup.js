function loadHighlights() {
  chrome.storage.local.get({ highlights: [] }, (result) => {
    const list = document.getElementById('highlight-list');
    list.innerHTML = '';
    result.highlights.forEach((text, index) => {
      const item = document.createElement('div');
      item.className = 'highlight-item';
      item.innerText = text;

      const deleteBtn = document.createElement('button');
      deleteBtn.innerText = 'Delete';
      deleteBtn.className = 'delete-btn';
      deleteBtn.onclick = () => {
        deleteHighlight(index);
      };

      item.appendChild(deleteBtn);
      list.appendChild(item);
    });
  });
}

function deleteHighlight(index) {
  chrome.storage.local.get({ highlights: [] }, (result) => {
    const newHighlights = result.highlights.filter((_, i) => i !== index);
    chrome.storage.local.set({ highlights: newHighlights }, () => {
      loadHighlights();
    });
  });
}

loadHighlights();