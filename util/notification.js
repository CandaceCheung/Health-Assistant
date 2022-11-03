export function showNotification (msg, time){
    const notification = document.querySelector('.notification')
    notification.innerHTML = msg
    notification.style.display = 'block'
    setTimeout(()=>{notification.style.display = 'none'}, time)
}