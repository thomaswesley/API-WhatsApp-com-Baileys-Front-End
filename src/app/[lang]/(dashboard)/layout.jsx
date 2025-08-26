// MUI Imports
import Button from '@mui/material/Button'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import Customizer from '@core/components/customizer'
import ScrollToTop from '@core/components/scroll-to-top'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'

const Layout = async ({ children, params }) => {
  // Vars
  const direction = i18n.langDirection[params.lang]
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <LayoutWrapper
        systemMode={systemMode}
        verticalLayout={
          <VerticalLayout
          
            /*navigation={<Navigation dictionary={dictionary} mode={mode} systemMode={systemMode} />}*/
            navigation={null}
            navbar={<Navbar />}
            
            footer={<VerticalFooter />}
          >
            {children}
          </VerticalLayout>
        }
        
      />
      <ScrollToTop className='mui-fixed'>
        <Button
          variant='contained'
          className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
        >
          <i className='ri-arrow-up-line' />
        </Button>
      </ScrollToTop>
      {/*<Customizer dir={direction} />*/}
    </Providers>
  )
}

export default Layout
