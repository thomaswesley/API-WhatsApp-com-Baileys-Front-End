'use client'

import { useEffect, useRef, useState } from 'react'

import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Popper from '@mui/material/Popper'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import AvatarWithBadge from './AvatarWithBadge'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CustomIconButton from '@core/components/mui/IconButton'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveUserData } from '@/redux-store/slices/chat'
import PersonIcon from '@mui/icons-material/Person'
import CustomAvatar from '@core/components/mui/Avatar'
import { useSettings } from '@core/hooks/useSettings'
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'
import { apiChat } from '@utils/api'
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const AvatarsIcon = () => {
  return (
    <div className='flex gap-4'>      
      <CustomAvatar sx={{ bgcolor: 'grey.500' }} >
        <PersonIcon sx={{ color: '#fff' }} />
      </CustomAvatar>
    </div>
  )
}

// Emoji Picker Component for selecting emojis
const EmojiPicker = ({ onChange, isBelowSmScreen, openEmojiPicker, setOpenEmojiPicker, anchorRef }) => {

  return (
    <>
      <Popper
        open={openEmojiPicker}
        transition
        disablePortal
        placement='top-start'
        className='z-[12]'
        anchorEl={anchorRef.current}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'top-start' ? 'right top' : 'left top' }}>
            <Paper>
              <ClickAwayListener onClickAway={() => setOpenEmojiPicker(false)}>
                <span>
                  <Picker
                    emojiSize={18}
                    theme='light'
                    data={data}
                    maxFrequentRows={1}
                    onEmojiSelect={emoji => {
                      onChange(emoji.native)
                      setOpenEmojiPicker(false)
                    }}
                    {...(isBelowSmScreen && { perLine: 8 })}
                  />
                </span>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

// Formats the chat data into a structured format for display.
const formatedChatData = (chats, profileUser) => {
  const formattedChatData = []
  let chatMessageSenderId = chats[0] ? chats[0].senderId : profileUser.id
  let msgGroup = {
    senderId: chatMessageSenderId,
    messages: []
  }

  chats.forEach((chat, index) => {
    if (chatMessageSenderId === chat.senderId) {
      msgGroup.messages.push({
        time: chat.time,
        message: chat.message,
        msgStatus: chat.msgStatus,
        image: chat.image
      })
    } else {
      chatMessageSenderId = chat.senderId
      formattedChatData.push(msgGroup)
      msgGroup = {
        senderId: chat.senderId,
        messages: [
          {
            time: chat.time,
            message: chat.message,
            msgStatus: chat.msgStatus,
            image: chat.image
          }
        ]
      }
    }

    if (index === chats.length - 1) formattedChatData.push(msgGroup)
  })

  return formattedChatData
}

// Renders the user avatar with badge and user information
const UserAvatar = ({ activeUser, setUserProfileLeftOpen, setBackdropOpen, photo }) => (
  <div
    className='flex items-center gap-4 cursor-pointer'
    onClick={() => {
      setUserProfileLeftOpen(true)
      setBackdropOpen(true)
    }}
  >
    <AvatarWithBadge
      alt={activeUser?.fullName}
      src={photo}
      color={activeUser?.avatarColor}
      badgeColor='success'
    />
    <div>
      <Typography color='text.primary'>{activeUser?.fullName}</Typography>
      <Typography variant='body2'>{activeUser?.role}</Typography>
    </div>
  </div>
)

const ChatWrapper = () => {

  const socket = io(process.env.NEXT_PUBLIC_APP_CHAT_NODE);
  const [messages, setMessages] = useState([])

  const [backdropOpen, setBackdropOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messageInputRef = useRef(null)
  const { settings } = useSettings()
  const isBelowLgScreen = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const isBelowMdScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const [userProfileRightOpen, setUserProfileRightOpen] = useState(false)
  const scrollRef = useRef(null)
  const [msg, setMsg] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)

  const [messageQrCode, setMessageQrCode] = useState('')
  const [messageDisconnected, setMessageDisconnected] = useState(false)
  const [name, setName] = useState('Usuário')
  const [userId, setUserId] = useState('Celular')
  const [photoUrl, setPhotoUrl] = useState(<AvatarsIcon />)
  const [photoUrlSender, setPhotoUrlSender] = useState(<AvatarsIcon />)
  
  const [qrSvg, setQrSvg] = useState('');

  const anchorRef = useRef(null)
  const open = Boolean(anchorEl)
  
  const [phone, setPhone] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  
  const isPhoneValid = (v) => {
    const d = String(v || '').replace(/\D/g, '');
    const with55 = d.startsWith('55') ? d : `55${d}`;
    
    return /^55\d{2}\d{8}$/.test(with55);
  };

  const normalizePhone = (v) => {
    const d = String(v || '').replace(/\D/g, '');
    const with55 = d.startsWith('55') ? d : `55${d}`;
    return `+${with55}`; // +55DDDNÚMERO (8)
  };

  const chatStore = {
  
    "profileUser": {
        "id": 1,
        "avatar": <AvatarWithBadge src={photoUrl} />,
        "fullName": "Thomas",
        "role": "Admin",
        "about": "",
        "status": "online",
        "settings": {
            "isTwoStepAuthVerificationEnabled": true,
            "isNotificationsOn": false
        }
    },
    "contacts": [
        {
            "id": 3,
            "fullName": "Charlene",
            "role": "API WhatsApp com Baileys",
            "avatarColor": "primary",
            "about": "",
            "status": "busy",
            "avatar": <AvatarWithBadge src={photoUrlSender} />
        },
    ],
    "chats": [
        {
            "id": 1,
            "userId": 3,
            "unseenMsgs": 0,
            "chat": messages
        },
    ],
    "activeUser": {
        "id": 3,
        "fullName": name,
        "role": userId,
        "avatarColor": "primary",
        "about": "",
        "status": "busy",
        "avatar": photoUrlSender
    }
  }

  const { activeUser, profileUser, contacts } = chatStore

  const handleToggle = () => {
    setOpenEmojiPicker(prevOpen => !prevOpen)
  }

  const handleClick = event => {
    setAnchorEl(prev => (prev ? null : event.currentTarget))
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // Function to scroll to bottom when new message is sent
  const scrollToBottom = () => {
    if (scrollRef.current) {
      if (isBelowLgScreen) {
        // @ts-ignore
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      } else {
        // @ts-ignore
        scrollRef.current._container.scrollTop = scrollRef.current._container.scrollHeight
      }
    }
  }

  // Wrapper for the chat log to handle scrolling
  const ScrollWrapper = ({ children, isBelowLgScreen, scrollRef, className }) => {
    if (isBelowLgScreen) {
      return (
        <div ref={scrollRef} className={classnames('bs-full overflow-y-auto overflow-x-hidden', className)}>
          {children}
        </div>
      )
    } else {
      return (
        <PerfectScrollbar ref={scrollRef} options={{ wheelPropagation: false }} className={className}>
          {children}
        </PerfectScrollbar>
      )
    }
  }  

  const activeUserChat = chatStore.chats.find(chat => chat.userId === chatStore.activeUser?.id)

  // Close user profile right drawer if backdrop is closed and user profile right drawer is open
  useEffect(() => {
    if (!backdropOpen && userProfileRightOpen) {
      setUserProfileRightOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backdropOpen])

  const handleSendMsg = (event, msg) => {

    event.preventDefault()

    if (!isPhoneValid(phone)) {
      alert('Por favor, digite o DDD + 8 dígitos (ex.: 11 34567890)')
      setPhoneErr('Por favor, digite o DDD + 8 dígitos (ex.: 11 34567890)');
      return;
    }

    const to = normalizePhone(phone);

    if (msg.trim() == '') {

      setMsg('')

      alert('Por favor, escreva uma mensagem.')

      return
    }
    
    const indiceArrayNewMessage = messages.length;

    const data = {
      "to": to,
      "message": msg,
      "indiceArrayNewMessage": indiceArrayNewMessage,
      "name": name,
      "userId": userId
    }

    const now = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });

    const dataUser = {
      'message': msg,
      'time': now,
      'senderId': 1,
      'msgStatus': {
        'isSent': true,
        'isDelivered': false,
        'isSeen': false,
      }
    }

    setMessages((prev) => [...prev, dataUser]);
    setMsg('')
    
    postMessages(data)
  }

  async function postMessages(dados) {

    try {
      const data = await apiChat.post('/api/whatsapp/enviar-mensagem', dados, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {

        //console.log('Resposta postMessages', response.data)

        if (!response.data.error) {

        }

        return response.data

      }).catch(error => {

        //console.log('/messages', error)

        return error
      })

      return data

    } catch (error) {

      //console.log('Erro postMessages', error)

      return error
    }
  }

  const getMessages = async () => {

    try {

      const data = await apiChat.get('/messages').then(response => {

        //console.log('Resposta getMessages', response.data)

        if (!response.data.error) {
          setMessages(response.data.data)
        }

        return response.data

      }).catch(error => {
      
        //console.log(error)
      
      }).finally(function () {
      
        // always executed      
      });

      return data

    } catch (error) {

      //console.log(error)
    }
  }

  useEffect(() => {
    const onConnected = (msg) => {

      //console.log('A conexão do WhatsApp está ativa', msg)

      setQrSvg('')
      setMessageQrCode(msg.message)
      setMessageDisconnected(false)

      if (msg.sock.name) {
        setName(msg.sock.name)
      }

      if (msg.sock.id) {
        setUserId(msg.sock.id)
      }

      if (msg.photoUrl) {
        setPhotoUrl(msg.photoUrl)
      }
    }

    const onQr = (msg) => {

      //console.log('Atualização do QR Code em connection.update', msg)
      
      setQrSvg(msg.svg)
      setMessageQrCode(msg.message)
      setMessageDisconnected(true)
    }

    const messageSaved = (msg) => {

      //console.log('A conexão do WhatsApp está ativa', msg)
    }

    const disconnected = (msg) => {

      //console.log('A conexão do WhatsApp está desativada', msg)
      
      setQrSvg(msg.svg)
      setMessageQrCode(msg.message)
      setMessageDisconnected(true)
    }

    const botResponse = (msg) => {

      //console.log('Mensagem de usuário recebida', msg)

      if (msg.content.photoUrl) {
        setPhotoUrlSender(msg.content.photoUrl)
      }

      setMessages((prev) => [...prev, msg.content]);

      //const index = msg.content.indiceArrayNewMessage;
      const indiceArrayNewMessage = messages.length;

      setMessages((prevMessages) => {

        const newMessages = [...prevMessages];
        const target = newMessages[indiceArrayNewMessage];

        if (target) {
          newMessages[indiceArrayNewMessage] = {
            ...target,
            msgStatus: {
              ...target.msgStatus,
              isSeen: true
            }
          };
        }

        return newMessages;
      });
    }

    socket.on('connected', onConnected)
    socket.on('qr', onQr)
    socket.on('message-saved', messageSaved)
    socket.on('disconnected', disconnected)
    socket.on('bot-response', botResponse)

    return () => {
      socket.off('connected', onConnected)
      socket.off('qr', onQr)
      socket.off('message-saved', messageSaved)
      socket.off('disconnected', disconnected)
      socket.off('bot-response', botResponse)
    }
  }, [])

  useEffect(() => {
    //getMessages()  
    //getStatusConexao()
    getGerarQrCode()
  }, [])

  useEffect(() => {
    //console.log('messages', messages)

    scrollToBottom()

  }, [chatStore])

  const getStatusConexao = async () => {

    try {
      
      const data = await apiChat
        .get('/api/whatsapp/status-conexao', {
          params: {
            t: Date.now()
          }
        }).then(response => {

          //console.log('/api/whatsapp/status-conexao')
          //console.log(response.data)

          if (!response.data.error) {
            //setMessageQrCode(response.data)
          } else {
            //getGerarQrCode()
          }

          return response.data
        })
        .catch(error => {
          //console.log('Error getStatusConexao', error)
          //setMessageQrCode(error.response.data)
          //getGerarQrCode()
        })
        .finally(function () {
          // always executed
        });

      return data

    } catch (error) {
      //console.log('Error getStatusConexao', error)
    }
  }

  const getGerarQrCode = async () => {

    try {
      
      const data = await apiChat
        .get('/api/whatsapp/gerar-qr-code', {
          params: {
            t: Date.now()
          }
        }).then(response => {

          //console.log('/api/whatsapp/gerar-qr-code')
          //console.log(response.data)

          setMessageQrCode(response.data.message)
          setQrSvg(response.data.data);

          if (response.data.sock.name) {
            setName(response.data.sock.name)
          }

          if (response.data.sock.id) {
            setUserId(response.data.sock.id)
          }

          if (response.data.photoUrl) {
            setPhotoUrl(response.data.photoUrl)
          }

          return response.data
        })
        .catch(error => {
          //console.log('Error getGerarQrCode', error)
          setMessageQrCode(error.response.data.message)
        })
        .finally(function () {
          // always executed
        });

      return data

    } catch (error) {
      //console.log('Error getGerarQrCode', error)
    }
  }

  const handleInputEndAdornment = () => {

    return (
      <div className='flex items-center gap-1'>
        {isBelowSmScreen ? (
          <>
            <IconButton
              id='option-menu'
              aria-haspopup='true'
              {...(open && { 'aria-expanded': true, 'aria-controls': 'share-menu' })}
              onClick={handleClick}
              ref={anchorRef}
            >
              <i className='ri-more-2-line text-textPrimary' />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem
                onClick={() => {
                  handleToggle()
                  handleClose()
                }}
              >
                <i className='ri-emotion-happy-line text-textPrimary' />
              </MenuItem>
            </Menu>
            <EmojiPicker
              anchorRef={anchorRef}
              openEmojiPicker={openEmojiPicker}
              setOpenEmojiPicker={setOpenEmojiPicker}
              isBelowSmScreen={isBelowSmScreen}
              onChange={value => {
                setMsg(msg + value)

                if (messageInputRef.current) {
                  messageInputRef.current.focus()
                }
              }}
            />
          </>
        ) : (
          <>
            <IconButton ref={anchorRef} size='small' onClick={handleToggle}>
              <i className='ri-emotion-happy-line text-textPrimary' />
            </IconButton>
            <EmojiPicker
              anchorRef={anchorRef}
              openEmojiPicker={openEmojiPicker}
              setOpenEmojiPicker={setOpenEmojiPicker}
              isBelowSmScreen={isBelowSmScreen}
              onChange={value => {
                setMsg(msg + value)

                if (messageInputRef.current) {
                  messageInputRef.current.focus()
                }
              }}
            />
          </>
        )}
        {isBelowSmScreen ? (
          <CustomIconButton 
            variant='contained' 
            color='primary' 
            type='submit' 
            sx={{
              borderRadius: '999px',
          }}>
            <i className='ri-send-plane-line' />
          </CustomIconButton>
        ) : (
          <Button
            variant='contained'
            color='primary'
            type='submit'
            endIcon={<i className='ri-send-plane-line' />}
            sx={{
              borderRadius: '999px',
            }}
          >
            Enviar
          </Button>
        )}
      </div>
    )
  }

  // Focus on message input when active user changes
  useEffect(() => {
    if (chatStore.activeUser?.id !== null && messageInputRef.current) {
      messageInputRef.current.focus()
    }
  }, [chatStore.activeUser])

  // Close backdrop when sidebar is open on below md screen
  useEffect(() => {
    if (!isBelowMdScreen && backdropOpen && sidebarOpen) {
      setBackdropOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBelowMdScreen])

  // Open backdrop when sidebar is open on below sm screen
  useEffect(() => {
    if (!isBelowSmScreen && sidebarOpen) {
      setBackdropOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBelowSmScreen])

  // Close sidebar when backdrop is closed on below md screen
  useEffect(() => {
    if (!backdropOpen && sidebarOpen) {
      setSidebarOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backdropOpen])

  return (

    <>

      <div
        className={classNames(commonLayoutClasses.contentHeightFixed, 'flex is-full overflow-hidden rounded relative', {
          border: settings.skin === 'bordered',
          'shadow-md': settings.skin !== 'bordered'
        })}
      >

        {activeUser && (
          <div className='flex flex-col flex-grow bs-full'>
            
            {messageQrCode && (
              <Grid item xs={3} className="flex justify-center" sx={{ p: 3 }}>
                <Alert severity={messageDisconnected === false ? 'success' : 'error'}>
                  {messageQrCode}
                </Alert>
              </Grid>
            )}

            {qrSvg && (
              <Grid item xs={12} className="flex justify-center" sx={{ pb: 3 }}>
                <Box
                  component="img"
                  alt="QR Code"
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`}
                  sx={{ width: 240, height: 240, display: 'block' }}
                />
              </Grid>
            )}

            {!qrSvg && (
              <Grid container>
                <Grid item 
                  xs={12} 
                  sm={3}
                  className="flex justify-center" 
                  sx={{ p: 3, mx: 'auto' }}
                >
                  <Box sx={{ display:'flex', flexDirection:'column', width:'100%' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Converse com algum amigo(a)
                    </Typography>

                    <TextField
                      label="Celular"
                      placeholder="1188882222"
                      size="small"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (phoneErr) setPhoneErr('');
                      }}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      error={Boolean(phoneErr)}
                      helperText={phoneErr || 'Ex.: 1188882222'}
                    />
                  </Box>
                </Grid>
              </Grid>
            )}

            <div className='flex items-center justify-between border-be plb-[17px] pli-5 bg-[var(--mui-palette-customColors-chatBg)]'>
              
              <UserAvatar
                activeUser={activeUser}
                setBackdropOpen={setBackdropOpen}
                setUserProfileLeftOpen={setUserProfileRightOpen}
                photo={photoUrl}
              />
            </div>

            <ScrollWrapper
              isBelowLgScreen={isBelowLgScreen}
              scrollRef={scrollRef}
              className='bg-[var(--mui-palette-customColors-chatBg)]'
            >
              <CardContent className='p-0'>
                {activeUserChat &&
                  formatedChatData(activeUserChat.chat, profileUser).map((msgGroup, index) => {
                    const isSender = msgGroup.senderId === profileUser.id
        
                    return (
                      <div key={index} className={classnames('flex gap-4 p-5', { 'flex-row-reverse': isSender })}>
                        
                        {!isSender && (
                          <AvatarWithBadge
                            alt={activeUser?.fullName}
                            src={activeUser.avatar}
                          />
                        )}

                        {isSender && profileUser.avatar}

                        <div
                          className={classnames('flex flex-col gap-2', {
                            'items-end': isSender,
                            'max-is-[65%]': !isBelowMdScreen,
                            'max-is-[75%]': isBelowMdScreen && !isBelowSmScreen,
                            'max-is-[calc(100%-5.75rem)]': isBelowSmScreen
                          })}
                        >
                          {msgGroup.messages.map((msg, index) => {
                            const bubbleClass = classnames('whitespace-pre-wrap pli-4 plb-2 shadow-xs', {
                              'bg-backgroundPaper rounded-e-lg rounded-b-lg': !isSender,
                              'bg-primary text-[var(--mui-palette-primary-contrastText)] rounded-s-lg rounded-b-lg': isSender
                            })

                            return (
                              <div key={index} className={bubbleClass} style={{ wordBreak: 'break-word' }}>
                                {/* IMAGEM PRIMEIRO (se houver) */}
                                {msg.image && (
                                  <Box
                                    component="img"
                                    src={msg.image}
                                    alt={msg.imageCaption || ''}
                                    sx={{ maxWidth: 280, borderRadius: 2, display: 'block', mb: (msg.message || msg.imageCaption) ? 1 : 0 }}
                                  />
                                )}

                                {/* MENSAGEM (ou legenda) ABAIXO */}
                                {(msg.message || msg.imageCaption) && (
                                  <Typography component="div" variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {msg.message || msg.imageCaption}
                                  </Typography>
                                )}
                              </div>
                            )
                          })}

                          {msgGroup.messages.map(
                            (msg, index) =>
                              index === msgGroup.messages.length - 1 &&
                              (isSender ? (
                                <div key={index} className='flex items-center gap-2'>
                                  {msg.msgStatus?.isSeen ? (
                                    <i className='ri-check-double-line text-success text-base' />
                                  ) : msg.msgStatus?.isDelivered ? (
                                    <i className='ri-check-double-line text-base' />
                                  ) : (
                                    msg.msgStatus?.isSent && <i className='ri-check-line text-base' />
                                  )}
                                  {index === activeUserChat.chat.length - 1 ? (
                                    <Typography variant='caption'>
                                      {new Intl.DateTimeFormat('pt-BR', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: false,
                                        timeZone: 'America/Sao_Paulo'
                                      }).format(new Date())}
                                    </Typography>
                                  ) : msg.time ? (
                                    <Typography variant='caption'>
                                      {new Intl.DateTimeFormat('pt-BR', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: false,
                                        timeZone: 'America/Sao_Paulo'
                                      }).format(new Date(msg.time))}
                                    </Typography>
                                  ) : null}
                                </div>
                              ) : index === activeUserChat.chat.length - 1 ? (
                                <Typography key={index} variant='caption'>
                                  {new Intl.DateTimeFormat('pt-BR', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: false,
                                    timeZone: 'America/Sao_Paulo'
                                  }).format(new Date())}
                                </Typography>
                              ) : msg.time ? (
                                <Typography key={index} variant='caption'>
                                  {new Intl.DateTimeFormat('pt-BR', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: false,
                                    timeZone: 'America/Sao_Paulo'
                                  }).format(new Date(msg.time))}
                                </Typography>
                              ) : null)
                          )}
                        </div>
                      </div>
                    )
                  })}
              </CardContent>
            </ScrollWrapper>

            <form
              autoComplete='off'
              onSubmit={event => handleSendMsg(event, msg)}
              className=' bg-[var(--mui-palette-customColors-chatBg)]'
            >
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder='Mensagem'
                value={msg}
                className='p-5'
                onChange={e => setMsg(e.target.value)}
                sx={{
                  '& fieldset': { border: '0' },
                  '& .MuiOutlinedInput-root': {
                    background: 'var(--mui-palette-background-paper)',
                    borderRadius: '999px !important',
                    boxShadow: 'var(--mui-customShadows-xs)'
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    handleSendMsg(e, msg)
                  }
                }}
                size='small'
                //inputRef={messageInputRef}
                InputProps={{ endAdornment: handleInputEndAdornment() }}
              />
            </form>

          </div>
        )}
        
      </div>

    </>
  )
}

export default ChatWrapper
