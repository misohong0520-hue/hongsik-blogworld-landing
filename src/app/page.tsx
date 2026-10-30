import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-16">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <Image src="/brand/icon.png" alt="" width={80} height={80} priority />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          {site.name}
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          키워드 선정부터 자료 준비, AI 글 작성·발행까지.
        </p>
        <a href={site.supportHref} className={buttonVariants({ size: "lg" })}>
          사용 문의
        </a>
      </div>
    </main>
  );
}
