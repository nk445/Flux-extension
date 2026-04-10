const TAB_THRESHOLD = 10;
let isInternalAction = false; // The Circuit Breaker

chrome.tabs.onCreated.addListener(async (newTab) => {
  // If we created this tab ourselves, ignore it
  if (isInternalAction) return;

  // If the new tab is meditation page, stop the logic
  if (tab.pendingUrl?.includes("meditate.html") || tab.url?.includes("meditate.html")) {
    return;
  }

  const tabs = await chrome.tabs.query({ windowType: 'normal' });
  
  if (tabs.length >= TAB_THRESHOLD) {
    isInternalAction = true; // Set the lock

    const tabIds = tabs.map(t => t.id);
    const group = await chrome.tabs.group({ tabIds: tabIds.slice(0, -1) });
    
    await chrome.tabGroups.update(group, { 
      title: "FLUX: ORGANIZED", 
      color: "cyan",
      collapsed: true 
    });

    // Create the tab, then reset the lock after a small delay
    await chrome.tabs.create({ url: "meditate.html" });
    
    // Brief timeout ensures the tab creation event is fully processed
    setTimeout(() => { isInternalAction = false; }, 500);
  }
});