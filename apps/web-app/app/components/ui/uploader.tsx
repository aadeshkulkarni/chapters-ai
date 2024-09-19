import { Video } from "@/app/db/model";
import { uploadToS3 } from "@/utils/fileUpload";
import executeInBackground from "@/app/worker/worker";
import { Card, CardContent } from "@/app/components/ui/card";

const create = async (formData: FormData) => {
  "use server";
  console.log("dump");
  const title = formData.get("title");
  const file = formData.get("video") as File;
  // TODO: Add file type = video check here

  if (!file.size || !title) {
    return;
  }

  const videoUrl = await uploadToS3(file);
  const video = await Video.create({ title, videoUrl });
  const newVideo = await video.save();
  await executeInBackground("task_queue", { ...newVideo });
};

export default function Uploader() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center p-8 overflow-hidden absolute inset-0 -z-10 h-full px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#111_40%,#63e_100%)]">

      <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm border-white/20 shadow-xl">
        <CardContent>
          <form action={create}>
            <div className="py-2">
              <label className="block mb-2 pt-2 text-md font-medium text-white/90">
                Ttile Input
              </label>
              <input
                name="title"
                type="text"
                placeholder="Title"
                className="bg-white/30 backdrop-blur-sm border text-gray-50 text-md placeholder:italic placeholder:text-white rounded-lg w-full p-2 cursor-pointer"
              />
            </div>
            <div className="py-2">
              <label className="flex flex-col items-center justify-center w-full h-full bg-white/30 backdrop-blur-sm border-2 border-slate-300 hover:border-slate-500 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-slate-100 text-white hover:text-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 m-5">
                  <svg
                    className="w-8 h-8 mb-4 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm italic">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs">Upload Video</p>
                </div>
                <input name="video" type="file" className="hidden" />
              </label>
            </div>
            <div className="py-2">
              <button
                type="button"
                className="w-full text-white bg-[#24292F] hover:bg-[#24292F]/60  font-medium rounded-lg text-sm px-5 py-2 text-center "
              >
                Process
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
