import axios from 'axios'

const apiChat = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_CHAT_NODE
})

export { apiChat }
