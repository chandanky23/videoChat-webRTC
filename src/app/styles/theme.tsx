
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { DefaultTheme } from 'styled-components'

const defaultTheme: DefaultTheme = {
  colors: {
    primaryColor: '#FF3554',
    secondaryColor: '#5ED0FA',
    grayColor: '#616E7C',
    redColor: '#E12D39',
    greenColor: '#27AB83',
    orangeColor: '#F0B429',

    borderColor: '#9AA5B1',
    shadowColor: '#CBD2D9',

    disabledColor: '#eeeeee',

    blackColor: '#000000',
    whiteColor: '#ffffff',
  },
}

type ThemeProps = React.ReactNode

const Theme: React.FC<ThemeProps> = ({ children }) => <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>

export default Theme