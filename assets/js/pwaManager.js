// PWA installation and offline management
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.init();
  }

  init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('SW registered'))
        .catch((err) => console.log('SW registration failed:', err));
    }

    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // Check online status
    this.updateOnlineStatus();
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }

  showInstallButton() {
    // Prevent duplicate buttons
    if (document.querySelector('.install-btn')) return;
    
    const installBtn = document.createElement('button');
    installBtn.textContent = '📱 Install App';
    installBtn.className = 'install-btn';
    installBtn.onclick = () => this.installApp();
    
    const topNav = document.querySelector('.top-nav');
    if (topNav) topNav.appendChild(installBtn);
  }

  async installApp() {
    if (!this.deferredPrompt) return;
    
    this.deferredPrompt.prompt();
    const result = await this.deferredPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      console.log('App installed');
    }
    this.deferredPrompt = null;
  }

  updateOnlineStatus() {
    const status = navigator.onLine ? 'online' : 'offline';
    document.body.setAttribute('data-connection', status);
    
    if (!navigator.onLine) {
      this.showOfflineMessage();
    }
  }

  showOfflineMessage() {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toast && toastMessage) {
      toastMessage.textContent = '📡 You are offline. Some features may be limited.';
      toast.classList.add('show', 'warning');
    }
  }
}

export default new PWAManager();