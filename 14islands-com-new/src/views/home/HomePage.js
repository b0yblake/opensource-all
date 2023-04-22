import React from 'react'

import Layout from 'layouts'

import { Container } from 'components/ui/layout'
import SEO from 'components/seo'
import ProjectCard, { ProjectsContainer } from 'components/ui/project-card'

import HomeHero from './components/home-hero'
import IntroText from './components/intro-text'
import MobileShowreelVideo from './components/home-hero/MobileShowreelLauncher'

const OFFSETS = [0, 0.01, 0.0, 0, 0.01, 0.0]

const chunk = s => a => Array.from({ length: Math.ceil(a.length / s) }, (v, i) => a.slice(i * s, i * s + s))

const chunkIn3 = chunk(3)

const HomePage = ({ data }) => {
  const page = data?.prismicHome?.data
  const metaTitle = page?.page_meta_title
  const metaDescription = page?.page_meta_description
  const metaThumbnail = page?.page_meta_thumbnail
  const projects = page?.projects || []

  return (
    <Layout fadeOut={false} fadeIn={false}>
      <SEO title={metaTitle} description={metaDescription} thumbnail={metaThumbnail} />

      <Container>
        <HomeHero
          showreelLoop={{ mp4: page.showreel_loop_mp4, webm: page.showreel_loop_webm }}
          showreelLoopMobile={{ mp4: page.showreel_loop_mobile_mp4, webm: page.showreel_loop_mobile_webm }}
          showreelFull={{ mp4: page.showreel_mp4, webm: page.showreel_webm }}
          showreelFullMobile={{ mp4: page.showreel_mobile_mp4, webm: page.showreel_mobile_webm }}
        />
      </Container>

      <Container>
        <IntroText items={page.intro_text_items} title={page.intro_text_title.text} />
        <MobileShowreelVideo showreelFullMobile={{ mp4: page.showreel_mobile_mp4, webm: page.showreel_mobile_webm }} />
      </Container>

      {chunkIn3(projects).map((slice, i) => (
        <Container key={i}>
          <ProjectsContainer>
            {slice
              .filter(({ node }) => node?.document?.uid)
              .map(({ node }, j) => (
                <ProjectCard
                  key={node.document.uid}
                  to={`/${node.document.uid}`}
                  node={node}
                  size={(j + 1) % 3 ? 'half' : 'full'}
                  index={j}
                  offset={OFFSETS[j % 4]}
                />
              ))}
          </ProjectsContainer>
        </Container>
      ))}
    </Layout>
  )
}

export default HomePage
