import React, { useState, useRef, useEffect } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useMergePrismicPreviewData } from 'gatsby-plugin-prismic-previews'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { useMatch } from '@reach/router'
import Headroom from 'react-headroom'
import { RichText } from 'prismic'

import useUIContext from 'context/ui'

import { useCanvas } from '@14islands/r3f-scroll-rig'
import Container from 'components/ui/layout/Container'
import ScrollLock from 'components/ui/layout/ScrollLock'
import Clickable from 'components/ui/clickable'
import Logo from 'components/ui/logo'
import Portal from 'components/ui/portal'
import MobileMenuBlobMesh, {
  RESET,
  CLOSED,
  TRANSITION_UP,
  TRANSITION_DOWN,
  OPEN,
} from 'components/three/mobile-menu-blob-mesh/MobileMenuBlobMesh'

import * as s from './Header.module.css'

const cn = classNames.bind(s)

const query = graphql`
  query HeaderQuery {
    prismicSiteSettings(uid: { eq: "site-settings" }, lang: { eq: "en-us" }) {
      _previewable
      data {
        header_phrase_desktop {
          richText
        }
        header_phrase_mobile {
          richText
        }
        header_lab_phrase {
          richText
        }
        header_menu
      }
    }
  }
`

const HeaderContent = () => {
  const staticData = useStaticQuery(query)
  const { data: prismicData } = useMergePrismicPreviewData(staticData)
  const data = prismicData?.prismicSiteSettings?.data
  const iconRef = useRef()
  const [transitionState, setTransitionState] = useState(RESET)

  const headerTheme = useUIContext(s => s.headerTheme)
  const isMobileMenuOpen = useUIContext(s => s.isMobileMenuOpen)
  const setMobileMenuOpen = useUIContext(s => s.setMobileMenuOpen)
  const disablePageTransitions = useUIContext(state => state.disablePageTransitions)
  const isPageTransitionDisabled = useUIContext(state => state.isPageTransitionDisabled)

  const isLab = !!useMatch('/lab')

  const updateMenuMesh = useCanvas(<MobileMenuBlobMesh iconRef={iconRef} transitionState={transitionState} />)
  const toggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen)
    setTransitionState(!isMobileMenuOpen ? OPEN : CLOSED)
    disablePageTransitions(!isMobileMenuOpen)
  }

  useEffect(() => {
    // Detect if menu was closed due to a page navigation (with disabled transition)
    if (!isMobileMenuOpen && isPageTransitionDisabled) {
      setTransitionState(RESET)
      disablePageTransitions(false)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    updateMenuMesh({ transitionState })
  }, [transitionState])

  const transitionDown = transitionState === TRANSITION_DOWN
  const transitionUp = transitionState === TRANSITION_UP
  const reset = transitionState === RESET

  return (
    <>
      <Container
        data-theme={headerTheme}
        className={cn('padding', 'colorTransition', { isOpen: isMobileMenuOpen })}
        id="header"
      >
        <div className={cn('main')}>
          <Clickable to="/" className={cn('logoLink', { isLab })}>
            <Logo isLab={isLab} className={cn('logo')} />
          </Clickable>

          <input className={cn('fallbackToggle')} type="checkbox" />

          <div className={cn('phrase', 'desktop')}>{RichText.render(data.header_phrase_desktop?.richText)}</div>

          <div className={cn('phrase', 'mobile')}>
            <button className={cn('toggle')} onClick={toggle} aria-label="open menu">
              <span className={cn('toggleLabel')}>
                <span className={cn('labelInner')}>{data.header_menu}</span>
              </span>
              <span className={cn('toggleIcons')} ref={iconRef}>
                <svg className={cn('icon')} width="24" height="24" viewBox="0 0 24 24">
                  <path d="M 6.32 1.233 C 7.912 0.43 9.684 0 11.5 0 L 11.5 0 L 11.5 0 C 13.343 0 15.141 0.443 16.751 1.269 C 17.805 1.81 18.779 2.516 19.632 3.369 C 21.788 5.525 23 8.452 23 11.5 C 23 14.549 21.788 17.476 19.632 19.632 C 18.769 20.495 17.782 21.207 16.714 21.75 C 15.113 22.564 13.329 23 11.5 23 C 9.671 23 7.886 22.564 6.285 21.75 C 5.217 21.206 4.231 20.495 3.368 19.632 C 1.212 17.476 0 14.549 0 11.5 C 0 8.452 1.212 5.525 3.368 3.369 C 4.241 2.496 5.239 1.779 6.32 1.233" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </Container>

      {isMobileMenuOpen && <ScrollLock />}

      <Portal root="1">
        <div className={cn('menu', { isOpen: isMobileMenuOpen, transitionDown, transitionUp, reset })}>
          <div className={cn('inner')}>
            <div className={cn('top')} data-theme="light">
              <Container>
                <div
                  className={cn('text')}
                  onClick={e => {
                    if (e.target.tagName.toLowerCase() === 'a') {
                      if (e.target.classList.contains('current')) {
                        return toggle()
                      }
                      setTransitionState(TRANSITION_DOWN)
                    }
                  }}
                >
                  {RichText.render(data.header_phrase_mobile?.richText)}
                </div>
              </Container>
            </div>

            <div className={cn('bottom')} data-theme="dark">
              <Container>
                <div
                  className={cn('text')}
                  onClick={e => {
                    if (e.target.tagName.toLowerCase() === 'a') {
                      if (e.target.classList.contains('current')) {
                        return toggle()
                      }
                      setTransitionState(TRANSITION_UP)
                    }
                  }}
                >
                  {RichText.render(data.header_lab_phrase?.richText)}
                </div>
              </Container>
            </div>
          </div>

          <button
            className={cn('toggle', 'inside', 'padding')}
            onClick={toggle}
            aria-label="open menu"
            data-theme={isMobileMenuOpen ? 'light' : headerTheme}
          >
            <div className={cn('toggleIcons', 'toggleIconsMenu')}>
              <svg className={cn('icon')} width="24" height="24" viewBox="0 0 24 24">
                <path d="M 1.833 0.797 C 5.055 4.02 8.277 7.242 11.499 10.465 L 11.548 10.416 L 21.166 0.798 C 21.638 1.269 22.109 1.741 22.581 2.212 C 19.359 5.434 16.137 8.657 12.915 11.879 C 15.914 14.879 18.914 17.879 21.913 20.879 C 21.442 21.35 20.971 21.822 20.5 22.293 C 17.5 19.293 14.499 16.293 11.499 13.293 C 8.499 16.293 5.499 19.293 2.499 22.293 C 2.028 21.822 1.556 21.35 1.085 20.879 C 4.085 17.879 7.085 14.879 10.085 11.879 C 6.863 8.657 3.64 5.434 0.418 2.212 C 0.89 1.74 1.361 1.269 1.833 0.797 C 1.833 0.797 1.833 0.797 1.833 0.797" />
              </svg>
            </div>
          </button>
        </div>
      </Portal>
    </>
  )
}

HeaderContent.propTypes = {
  theme: PropTypes.string,
}

// Wrap static query in element that is persistent
const Header = props => {
  const hideHeader = useUIContext(s => s.hideHeader)
  const isLabTransitionRunning = useUIContext(state => state.isLabTransitionRunning)
  const isPageTransitionActive = useUIContext(state => state.isPageTransitionActive)
  const hidden = hideHeader || isLabTransitionRunning

  return (
    <header className={cn('header', { hidden }, { idle: isPageTransitionActive })}>
      <Headroom className={cn('headroomWrapper')}>
        <HeaderContent {...props} />
      </Headroom>
    </header>
  )
}

export default Header
