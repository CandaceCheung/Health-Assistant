export function formatAsPercent(num) {
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num / 100);
}

export function showNotification (msg, time){
    const notification = document.querySelector('.notification')
    notification.innerHTML = msg
    notification.style.display = 'block'
    setTimeout(()=>{notification.style.display = 'none'}, time)
}