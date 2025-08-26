'use client'

// React Imports
import { useRef, useState } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Icon } from '@iconify/react'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const UserDropdown = () => {
  
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef(null)

  // Hooks
  const router = useRouter()

  const { settings } = useSettings()
  const { lang: locale } = useParams()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event, url) => {
    if (url) {
      router.push(getLocalizedUrl(url, locale))
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target)) {
      return
    }

    setOpen(false)
  }

  return (
    <Box>
      
      <Box>
        <Button
          ref={anchorRef}
          onClick={handleDropdownOpen}
          size="small"
          variant="outlined"
          startIcon={<Icon icon="mdi:user-circle-outline" />}
          sx={{ 
            ml: 2, 
            textTransform: "none", 
            borderRadius: "20px",
            "& .MuiButton-startIcon": {
              marginRight: 1,
            },
          }}
        >
          Entrar
        </Button>
      </Box>

      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper
              elevation={settings.skin === 'bordered' ? 0 : 8}
              {...(settings.skin === 'bordered' && { className: 'border' })}
            >
              <ClickAwayListener onClickAway={e => handleDropdownClose(e)}>

                <MenuList>
                      
                    <>

                      <div className='flex items-center plb-2 pli-4 gap-2' tabIndex={-1}>

                        <Box sx={{ width: '100%' }} >

                          <Typography sx={{ fontSize: '0.75rem', mb: 3 }} color="text.primary">
                            Entre para ver seus favoritos, promoções e muito mais
                          </Typography>

                          <Button
                            //onClick={e => handleDropdownClose(e, '/entrar')}
                            fullWidth 
                            size="small"
                            variant="contained"
                            startIcon={<Icon icon="mdi:user-circle-outline" />}
                            sx={{ 
                              textTransform: "none", 
                              borderRadius: "20px",
                              "& .MuiButton-startIcon": {
                                marginRight: 1,
                              },
                            }}
                          >
                            Entrar
                          </Button>
                        </Box>

                      </div>

                    </>

                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

    </Box>
  )
}

export default UserDropdown
