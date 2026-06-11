import React from 'react'
import Image from 'next/image'

const loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
        <Image src="/assets/loading.gif" alt="Loading..."  height={80} width={80}/>
    </div>
  )
}

export default loading