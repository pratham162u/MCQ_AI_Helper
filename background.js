// Create context menu for right-click
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "findAnswer",
    title: "Find Answer with AI",
    contexts: ["selection"]
  });
});

// Gemini API call
async function callGemini(prompt) {
  const apiKey = "AIzaSyAyikofXJNaUGHnjdoPfvBdU1vW0QuNhIM"; // <-- replace with your API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await resp.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found";
}

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "findAnswer") {
    const questionText = info.selectionText;

    // ✅ Updated prompt: Only answer, no explanation
    const prompt = `MCQ Question with options:\n${questionText}\nGive only the correct option (option letter and text). Do not give explanation. Format as: "✅ Correct Answer: <option>) <text>"`;

    const answer = await callGemini(prompt);

    // Inject answer popup
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (ans) => {
        let div = document.createElement("div");
        div.innerText = ans;
        div.style.position = "fixed";
        div.style.bottom = "20px";
        div.style.left = "50%";
        div.style.transform = "translateX(-50%)";
        div.style.background = "black";
        div.style.color = "white";
        div.style.padding = "10px 20px";
        div.style.borderRadius = "10px";
        div.style.fontSize = "16px";
        div.style.fontWeight = "bold";
        div.style.zIndex = 999999;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 5000);
      },
      args: [answer]
    });
  }
});
