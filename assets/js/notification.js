async function notify() {
    let permission = await Notification.requestPermission();
    if (permission === "granted") {
      // create a notification object
      const notification = new Notification('Hi Welcome to Weather app', {
        body: '👋',
      });
  
      setTimeout(() => {
        notification.close();
      }, 10 * 1000);
  
  
      // navigating to another page
      // notification.addEventListener('click', function () {
      //   window.open('');
      // });
    }
  }

  export default notify;