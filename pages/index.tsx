import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'

export const getStaticProps: GetStaticProps = async () => {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  const { data } = await supabaseAdmin.from('images').select('*').order('id')

  return {
    props: { images: data },
  }
}

interface ImageType {
  id: number
  name: string
  href: string
  username: string
  imageSrc: string
}
const Home = ({ images }: { images: ImageType[] }) => {
  return (
    <>
      <Head>
        <title>Image Gallery</title>
      </Head>
      <div className='max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
        <div className='grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
          {images.map((img) => (
            <BlurImage key={img.id} image={img} />
          ))}
        </div>
      </div>
    </>
  )
}

const BlurImage = ({ image }: { image: ImageType }) => {
  const [isLoading, setIsLoading] = useState(true)
  const cn = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ')
  }
  return (
    <a href={image.href} className='group'>
      <div className='aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 w-full overflow-hidden rounded-lg bg-gray-200'>
        <Image
          layout='fill'
          className={cn(
            'group-hover:opacity-90 duration-200 ease-in-out',
            isLoading
              ? 'grayscale blur-2xl scale-110'
              : 'grayscale-0 blur-0 scale-100'
          )}
          onLoadingComplete={() => setIsLoading(false)}
          objectFit='cover'
          src={image.imageSrc}
          alt=''
        />
      </div>
      <h3 className='mt-4 text-sm text-gray-700'>{image.name}</h3>
      <p className='mt-1 text-lg font-medium text-gray-900'>{image.username}</p>
    </a>
  )
}

export default Home
