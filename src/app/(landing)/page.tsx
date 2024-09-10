import AuthButtons from "@/components/buttons/auth-buttons";
import GetStartedButton from "@/components/buttons/get-started-button";
import Headline from "@/app/(landing)/components/head-line";
import ValuePropositions from "@/app/(landing)/components/value-propositions";
import { AuthLoader } from "@/components/loader";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <main className="px-4 flex flex-col min-h-screen items-start bg-gradient-to-br from-[#faf0ff] to-[#ece0ff] pb-20">
      <Suspense fallback={<AuthLoader className="ml-auto mt-6" />}>
        <AuthButtons className="ml-auto mt-6" />
      </Suspense>
      <div className="relative mx-auto w-full flex flex-col items-center gap-y-8 mt-10 lg:mt-16">
        <Headline />
        <GetStartedButton />
        {
          // TODO: Thay đổi ảnh
        }
        <div className="w-full  md:max-w-2xl rounded-lg overflow-hidden">
          <AspectRatio
            className="flex items-center justify-center"
            ratio={16 / 9}
          >
            <Image
              style={{ imageRendering: "crisp-edges" }}
              src={"/preview.jpg"}
              alt="Preview"
              fill
              objectFit="cover"
              // width={500}
              // height={500}
            />
          </AspectRatio>
        </div>
        <ValuePropositions />
      </div>
    </main>
  );
}
