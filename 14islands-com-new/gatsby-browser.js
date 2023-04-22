/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from 'react'
import { GlobalCanvas } from '@14islands/r3f-scroll-rig'
import { PrismicPreviewProvider } from 'gatsby-plugin-prismic-previews'

import { UISideEffects } from 'context/ui'

import Header from 'components/ui/header'
import CursorTracker from 'components/ui/cursor-tracker'
import CursorBlob from 'components/three/cursor-blob'
import TransitionBlob from 'components/three/transition-blob'
import LabTransitionMesh from 'components/three/lab-transition-mesh'
import AssetsManager from 'components/three/AssetsManager'
import { BackgroundBubblesMesh } from 'components/ui/bubbles/BackgroundBubbles'
import BubblesMesh from 'components/ui/bubbles/Bubbles'

// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({ element }) => {
  return (
    <PrismicPreviewProvider>
      <UISideEffects />

      {element}

      <GlobalCanvas
        // these settings are no longer default in scroll-rig
        gl={{
          antialias: false, // only 2D so we antialias manually in frag shader
          depth: false, //  only 2D so no depth needed
        }}
        frameloop="demand" // only render on demand
        raycaster={{ enabled: false }} // disable raycaster
        flat={false} // turn off tonemapping by default to provide better hex matching - images get weird color and hex won't match DOM
        style={{
          zIndex: 1, // place canvas on top of DOM
          pointerEvents: 'none', // ignore events
        }}
        orthographic // no need for a perspective camera, everything is flat layers
      >
        <AssetsManager />
        <BackgroundBubblesMesh />
        <BubblesMesh />
        <TransitionBlob />
        <LabTransitionMesh />
        <CursorBlob />
      </GlobalCanvas>
      <CursorTracker />
    </PrismicPreviewProvider>
  )
}

// eslint-disable-next-line react/prop-types
export const wrapPageElement = ({ element }) => {
  return (
    <>
      <Header />
      {element}
    </>
  )
}

// After ReactDOM.render has executed
export const onInitialClientRender = () => {}
