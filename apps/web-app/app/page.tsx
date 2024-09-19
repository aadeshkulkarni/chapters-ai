import { Video } from './db/model'
import { uploadToS3 } from '@/utils/fileUpload'
import executeInBackground from '@/app/worker/worker'

import Uploader from '@/app/components/ui/uploader';

const create = async (formData: FormData) => {
    'use server'
    console.log('dump')
    const title = formData.get('title')
    const file = formData.get('video') as File
    // TODOS: add file type = video check here
    if (!file.size || !title) {
        return
    }

    const videoUrl = await uploadToS3(file)
    const video = await Video.create({ title: title, videoUrl: videoUrl })
    const newVideo = await video.save()
    await executeInBackground('task_queue', { ...newVideo })
}

export default function Home() {
    return (
        <Uploader />
    )
}
