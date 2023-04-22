import { useEffect, useMemo } from 'react'
import { TextureLoader } from 'three'

import useUIContext from 'context/ui'

import bigBubbleTexture from 'assets/images/lab/big-reflection-512x512.min.png'
import smallBubbleTexture from 'assets/images/lab/small-reflection-256x256.min.png'
import labCornerTexture from 'assets/images/lab/corner/20px-blur.png'

// Loads shared assets when App loads
export const AssetsManager = () => {
  // const assets = useUIContext(state => state.assets)
  const setAsset = useUIContext(state => state.setAsset)

  const textureLoader = useMemo(() => new TextureLoader(), [])

  useEffect(() => {
    // Load bubble textures
    textureLoader.load(bigBubbleTexture, texture => {
      setAsset('bigBubbleTexture', texture)
    })
    textureLoader.load(smallBubbleTexture, texture => {
      setAsset('smallBubbleTexture', texture)
    })

    // Load labCTA texture
    textureLoader.load(labCornerTexture, texture => {
      setAsset('labCornerTexture', texture)
    })
  }, [])

  return null
}

export default AssetsManager
