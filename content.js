let timerId;
document.addEventListener('mouseup', (e) => {
  if(timerId){
    clearTimeout(timerId);
  }
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    const existingPopup = document.getElementById('save-highlight-popup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'save-highlight-popup';
    popup.style.position = 'absolute';
    popup.style.top = `${e.pageY}px`;
    popup.style.left = `${e.pageX}px`;
    popup.style.background = '#ffc';
    popup.style.padding = '5px 10px';
    popup.style.border = '1px solid #ccc';
    popup.style.zIndex = 9999;
    
    const savedBtn = document.createElement('p');
    const summarizeBtn = document.createElement('p');
    savedBtn.innerText = 'Save Highlight?';
    savedBtn.style.cursor = 'pointer';
    savedBtn.style.border = '1px solid #ccc';
    savedBtn.style.padding = '2px';
    summarizeBtn.innerText = "Summarize";
    summarizeBtn.style.cursor = 'pointer';
    summarizeBtn.style.border = '1px solid #ccc';
    summarizeBtn.style.padding = '2px';

    const summaryPara = document.createElement('p');
    summaryPara.style.color = '#00008B';

    summarizeBtn.onclick = ()=>{
        // calling api for text summrize-----
        clearTimeout(timerId);
        timerId =  setTimeout(() => {
          popup.remove();
        }, 5000);
        summarizeText(selectedText).then((response)=>{
          summaryPara.innerText = response;
          popup.appendChild(summaryPara); 
          clearTimeout(timerId);
          setTimeout(() => {
            popup.remove();
          }, 8000);
        });
    }

    

    savedBtn.onclick = () => {
      chrome.storage.local.get({ highlights: [] }, (result) => {
        const newHighlights = [...result.highlights, selectedText];
        chrome.storage.local.set({ highlights: newHighlights });        
        popup.remove();
      });
    };
    
    popup.appendChild(savedBtn);
    popup.appendChild(summarizeBtn);
    popup.appendChild(summaryPara);
    document.body.appendChild(popup);

    timerId = setTimeout(() => {
      popup.remove();
    }, 3000);
  }
});


async function summarizeText(text) {
  const apiKey = "YOUR_API_KEY";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  const body = {
    contents: [
      {
        parts: [
          { text: `Summarize this text in less than 50 words or if it is a simple word give its meaning only:\n\n${text}` }
        ]
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

  console.log("Summary:\n", summary);
  // console.log("data",data.candidates?.[0]);
  return summary;
}

// summarizeText("apple");