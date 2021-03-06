import { isNotNull, isNotEmpty } from './storage'

export const set = (key, value = 0, expiryInMinutes) => {
  let expires = ''
  expiryInMinutes = isNotEmpty(expiryInMinutes) ? expiryInMinutes : 5
  if (expiryInMinutes) {
    const date = new Date();
    date.setTime(date.getTime() + (expiryInMinutes * 60 * 1000))
    expires = '; expires=' + date.toGMTString()
  }
  document.cookie = key + '=' + JSON.stringify(value) + expires + '; path=/'
  return value
}

export const get = key => {
  key = key + '='
  const cookies = document.cookie.split(';')
  for(let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i]
    while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length)
    if (cookie.indexOf(key) === 0) return JSON.parse(cookie.substring(key.length, cookie.length))
  }
  return null
}

export const remove = key => {
  if (isNotNull(get(key))) {
    set(key, '', -1)
    return true
  }
  return false
}

export const clear = () => {
  const cookies = document.cookie.split(";")
  for(let i = 0; i < cookies.length; i++) {
    set(cookies[i].split("=")[0], '', -1)
  }
}

export const keys = () => {
  const keys = []
  const cookies = document.cookie.split(';')
  for(let i = 0; i < cookies.length; i++) {
    const key = cookies[i].split("=")[0];
    if(key !== '') keys.push(key)
  }
  return keys
}

export default () => ({ get, set, remove, clear, keys })